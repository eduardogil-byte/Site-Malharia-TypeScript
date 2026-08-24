import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { PublicProductCard } from "../../catalog/components/PublicProductCard";
import type { PublicProduct } from "../../catalog/types/publicCatalog";

type PublicProductCarouselProps = {
  label: string;
  products: PublicProduct[];
  useDesktopGrid?: boolean;
};

const SCROLL_EDGE_TOLERANCE = 2;
const DRAG_THRESHOLD = 6;
const DRAG_ADVANCE_THRESHOLD = 48;
const SNAP_RESTORE_DELAY = 400;

function getPagePositions(track: HTMLUListElement) {
  const maximumScrollLeft = track.scrollWidth - track.clientWidth;

  if (maximumScrollLeft <= SCROLL_EDGE_TOLERANCE) {
    return [0];
  }

  const slides = Array.from(track.children) as HTMLElement[];
  const firstSlide = slides[0];
  const secondSlide = slides[1];
  let pageDistance = track.clientWidth;

  if (firstSlide && secondSlide) {
    const slideStep = secondSlide.offsetLeft - firstSlide.offsetLeft;

    if (slideStep > 0) {
      const gap = Math.max(0, slideStep - firstSlide.offsetWidth);
      const visibleSlides = Math.max(
        1,
        Math.floor((track.clientWidth + gap) / slideStep),
      );

      pageDistance = slideStep * visibleSlides;
    }
  }

  const pageCount = Math.ceil(maximumScrollLeft / pageDistance) + 1;

  return Array.from({ length: pageCount }, (_, index) =>
    index === pageCount - 1
      ? maximumScrollLeft
      : Math.min(index * pageDistance, maximumScrollLeft),
  );
}

function getNearestPage(pagePositions: number[], scrollLeft: number) {
  return pagePositions.reduce((nearestPage, position, index) =>
    Math.abs(scrollLeft - position) <
    Math.abs(scrollLeft - pagePositions[nearestPage])
      ? index
      : nearestPage,
  0);
}

function ArrowIcon({ direction }: { direction: "previous" | "next" }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      className="size-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d={direction === "previous" ? "M15 18 9 12l6-6" : "m9 18 6-6-6-6"}
      />
    </svg>
  );
}

export function PublicProductCarousel({
  label,
  products,
  useDesktopGrid = false,
}: PublicProductCarouselProps) {
  const trackRef = useRef<HTMLUListElement>(null);
  const dragRef = useRef({
    pointerId: null as number | null,
    startX: 0,
    startScrollLeft: 0,
    distance: 0,
    hasMoved: false,
  });
  const snapRestoreTimeoutRef = useRef<number | null>(null);
  const [canScrollPrevious, setCanScrollPrevious] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(1);

  const updateNavigation = useCallback(() => {
    const track = trackRef.current;

    if (!track) {
      return;
    }

    const maximumScrollLeft = track.scrollWidth - track.clientWidth;
    const pagePositions = getPagePositions(track);
    const nearestPage = getNearestPage(pagePositions, track.scrollLeft);

    setCanScrollPrevious(track.scrollLeft > SCROLL_EDGE_TOLERANCE);
    setCanScrollNext(
      maximumScrollLeft > SCROLL_EDGE_TOLERANCE &&
        track.scrollLeft < maximumScrollLeft - SCROLL_EDGE_TOLERANCE,
    );
    setCurrentPage(nearestPage);
    setPageCount(pagePositions.length);
  }, []);

  useEffect(() => {
    const track = trackRef.current;

    if (!track) {
      return;
    }

    const initialUpdateFrame = window.requestAnimationFrame(updateNavigation);
    window.addEventListener("resize", updateNavigation);

    const resizeObserver =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(updateNavigation);

    resizeObserver?.observe(track);

    return () => {
      window.cancelAnimationFrame(initialUpdateFrame);
      window.removeEventListener("resize", updateNavigation);
      resizeObserver?.disconnect();

      if (snapRestoreTimeoutRef.current !== null) {
        window.clearTimeout(snapRestoreTimeoutRef.current);
      }
    };
  }, [products.length, updateNavigation]);

  function scrollToPage(page: number) {
    const track = trackRef.current;

    if (!track) {
      return;
    }

    const pagePositions = getPagePositions(track);
    const targetPage = Math.max(0, Math.min(page, pagePositions.length - 1));

    track.scrollTo({
      left: pagePositions[targetPage],
      behavior: "smooth",
    });
  }

  function handlePointerDown(event: ReactPointerEvent<HTMLUListElement>) {
    if (event.pointerType !== "mouse" || event.button !== 0) {
      return;
    }

    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startScrollLeft: event.currentTarget.scrollLeft,
      distance: 0,
      hasMoved: false,
    };

    if (snapRestoreTimeoutRef.current !== null) {
      window.clearTimeout(snapRestoreTimeoutRef.current);
      snapRestoreTimeoutRef.current = null;
    }

    event.currentTarget.style.scrollSnapType = "none";
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLUListElement>) {
    const drag = dragRef.current;

    if (drag.pointerId !== event.pointerId) {
      return;
    }

    const distance = event.clientX - drag.startX;

    drag.distance = distance;

    if (Math.abs(distance) >= DRAG_THRESHOLD) {
      if (!drag.hasMoved) {
        event.currentTarget.setPointerCapture(event.pointerId);
      }

      drag.hasMoved = true;
      event.preventDefault();
      event.currentTarget.scrollLeft = drag.startScrollLeft - distance;
    }
  }

  function handlePointerEnd(event: ReactPointerEvent<HTMLUListElement>) {
    const drag = dragRef.current;

    if (drag.pointerId !== event.pointerId) {
      return;
    }

    drag.pointerId = null;

    if (
      drag.hasMoved &&
      event.currentTarget.hasPointerCapture(event.pointerId)
    ) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    if (drag.hasMoved) {
      const slides = Array.from(event.currentTarget.children) as HTMLElement[];
      const firstSlideLeft = slides[0]?.offsetLeft ?? 0;
      const maximumScrollLeft =
        event.currentTarget.scrollWidth - event.currentTarget.clientWidth;
      const slidePositions = slides.map((slide) =>
        Math.min(slide.offsetLeft - firstSlideLeft, maximumScrollLeft),
      );
      const startingSlide = getNearestPage(
        slidePositions,
        drag.startScrollLeft,
      );
      const slideDirection =
        Math.abs(drag.distance) >= DRAG_ADVANCE_THRESHOLD
          ? Math.sign(-drag.distance)
          : 0;
      const targetSlide = Math.max(
        0,
        Math.min(startingSlide + slideDirection, slidePositions.length - 1),
      );

      event.currentTarget.scrollTo({
        left: slidePositions[targetSlide],
        behavior: "smooth",
      });

      const track = event.currentTarget;

      snapRestoreTimeoutRef.current = window.setTimeout(() => {
        track.style.scrollSnapType = "";
        snapRestoreTimeoutRef.current = null;
      }, SNAP_RESTORE_DELAY);
    } else {
      event.currentTarget.style.scrollSnapType = "";
    }
  }

  const hasOverflow = canScrollPrevious || canScrollNext;

  const desktopGridClassName =
    products.length === 2
      ? "md:max-w-[40rem] md:grid-cols-2"
      : products.length === 3
        ? "md:max-w-[61rem] md:grid-cols-2 lg:grid-cols-3"
        : "md:grid-cols-2 lg:grid-cols-4";

  const trackLayoutClassName = useDesktopGrid
    ? `md:mx-0 md:grid md:cursor-auto md:gap-x-6 md:gap-y-10 md:overflow-visible md:px-0 md:pb-0 md:snap-none md:active:cursor-auto ${desktopGridClassName}`
    : "lg:mx-14 lg:px-0 xl:gap-6";

  return (
    <div
      className="relative mt-8 sm:mt-10"
      role="region"
      aria-roledescription="carrossel"
      aria-label={`Produtos de ${label}`}
    >
      <div className="relative">
        {hasOverflow && !useDesktopGrid && (
          <div className="pointer-events-none absolute inset-x-0 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-between lg:flex">
            <button
              type="button"
              onClick={() => scrollToPage(currentPage - 1)}
              disabled={!canScrollPrevious}
              aria-label={`Ver produtos anteriores de ${label}`}
              className="pointer-events-auto inline-flex size-10 items-center justify-center rounded-full border border-stone-300 bg-white text-stone-900 shadow-sm hover:border-stone-950 hover:bg-stone-50 disabled:border-stone-200 disabled:text-stone-300 disabled:shadow-none"
            >
              <ArrowIcon direction="previous" />
            </button>

            <button
              type="button"
              onClick={() => scrollToPage(currentPage + 1)}
              disabled={!canScrollNext}
              aria-label={`Ver próximos produtos de ${label}`}
              className="pointer-events-auto inline-flex size-10 items-center justify-center rounded-full border border-stone-300 bg-white text-stone-900 shadow-sm hover:border-stone-950 hover:bg-stone-50 disabled:border-stone-200 disabled:text-stone-300 disabled:shadow-none"
            >
              <ArrowIcon direction="next" />
            </button>
          </div>
        )}

        <ul
          ref={trackRef}
          onScroll={updateNavigation}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerEnd}
          onPointerCancel={handlePointerEnd}
          onDragStart={(event) => event.preventDefault()}
          onClickCapture={(event) => {
            if (dragRef.current.hasMoved) {
              event.preventDefault();
              event.stopPropagation();
              dragRef.current.hasMoved = false;
            }
          }}
          className={`-mx-5 flex cursor-grab scroll-smooth snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-3 overscroll-x-contain active:cursor-grabbing [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:-mx-8 sm:gap-5 sm:px-8 sm:snap-proximity ${trackLayoutClassName}`}
        >
          {products.map((product) => (
            <li
              key={product.id}
              className={[
                "h-auto min-w-0 shrink-0 basis-[87%] snap-start",
                useDesktopGrid
                  ? "sm:basis-[calc(50%_-_0.625rem)] md:basis-auto md:shrink md:snap-none"
                  : "sm:basis-[calc(50%_-_0.625rem)] md:basis-[calc(40%_-_0.75rem)] lg:basis-[calc(33.333%_-_0.8333rem)] xl:basis-[calc(25%_-_1.125rem)]",
              ].join(" ")}
            >
              <PublicProductCard product={product} />
            </li>
          ))}
        </ul>
      </div>

      {pageCount > 1 && (
        <div
          className={useDesktopGrid ? "mt-2 flex justify-center md:hidden" : "mt-2 flex justify-center"}
          role="group"
          aria-label={`Navegação dos produtos de ${label}`}
        >
          {Array.from({ length: pageCount }, (_, index) => {
            const isCurrent = index === currentPage;

            return (
              <button
                key={index}
                type="button"
                onClick={() => scrollToPage(index)}
                aria-label={`Ir para página ${index + 1} de ${pageCount}`}
                aria-current={isCurrent ? "page" : undefined}
                className="group inline-flex size-8 items-center justify-center"
              >
                <span
                  aria-hidden="true"
                  className={[
                    "h-1.5 rounded-full transition-all duration-200",
                    isCurrent
                      ? "w-6 bg-stone-900"
                      : "w-1.5 bg-stone-300 group-hover:bg-stone-500",
                  ].join(" ")}
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
