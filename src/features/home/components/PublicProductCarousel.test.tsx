import { fireEvent, screen, within } from "@testing-library/react";
import { useLocation } from "react-router";
import { describe, expect, it, vi } from "vitest";
import { renderWithRouter } from "../../../test/renderWithRouter";
import type { PublicProduct } from "../../catalog/types/publicCatalog";
import { PublicProductCarousel } from "./PublicProductCarousel";

function createProduct(index: number): PublicProduct {
  return {
    id: `produto-${index}`,
    categoriaId: "categoria-1",
    nome: `Produto ${index}`,
    slug: `produto-${index}`,
    descricaoCurta: `Descrição do produto ${index}.`,
    descricao: null,
    disponivel: true,
    atributos: {},
    mensagemWhatsapp: null,
    categoria: {
      id: "categoria-1",
      nome: "Malhas",
      slug: "malhas",
    },
    imagens: [],
  };
}

const products = Array.from({ length: 6 }, (_, index) =>
  createProduct(index + 1),
);

function CurrentPath() {
  return <span data-testid="current-path">{useLocation().pathname}</span>;
}

function configureTrack(track: HTMLElement, slides: HTMLElement[]) {
  const scrollTo = vi.fn();

  Object.defineProperties(track, {
    clientWidth: { configurable: true, value: 800 },
    scrollWidth: { configurable: true, value: 1600 },
    scrollLeft: { configurable: true, value: 0, writable: true },
    scrollTo: { configurable: true, value: scrollTo },
    setPointerCapture: { configurable: true, value: vi.fn() },
    hasPointerCapture: { configurable: true, value: () => true },
    releasePointerCapture: { configurable: true, value: vi.fn() },
  });
  Object.defineProperties(slides[0], {
    offsetLeft: { configurable: true, value: 0 },
    offsetWidth: { configurable: true, value: 185 },
  });
  Object.defineProperty(slides[1], "offsetLeft", {
    configurable: true,
    value: 205,
  });

  return scrollTo;
}

describe("PublicProductCarousel", () => {
  it("renderiza os produtos e permite abrir um deles", async () => {
    const { user } = renderWithRouter(
      <>
        <PublicProductCarousel label="Lançamentos" products={products} />
        <CurrentPath />
      </>,
    );

    const carousel = screen.getByRole("region", {
      name: "Produtos de Lançamentos",
    });

    expect(within(carousel).getAllByRole("listitem")).toHaveLength(6);
    expect(
      within(carousel).getByRole("link", { name: /Produto 1/i }),
    ).toHaveAttribute("href", "/produto/produto-1");

    await user.click(
      within(carousel).getByRole("link", { name: /Produto 1/i }),
    );

    expect(screen.getByTestId("current-path")).toHaveTextContent(
      "/produto/produto-1",
    );
  });

  it("controla a navegação de acordo com a posição da rolagem", async () => {
    const { user } = renderWithRouter(
      <PublicProductCarousel label="Destaques" products={products} />,
    );

    const carousel = screen.getByRole("region", {
      name: "Produtos de Destaques",
    });
    const track = within(carousel).getByRole("list");
    const slides = within(track).getAllByRole("listitem");
    const scrollTo = configureTrack(track, slides);

    fireEvent(window, new Event("resize"));

    const previousButton = within(carousel).getByRole("button", {
      name: "Ver produtos anteriores de Destaques",
    });
    const nextButton = within(carousel).getByRole("button", {
      name: "Ver próximos produtos de Destaques",
    });

    expect(previousButton).toBeDisabled();
    expect(nextButton).toBeEnabled();
    expect(
      within(carousel).getByRole("button", { name: "Ir para página 1 de 2" }),
    ).toHaveAttribute("aria-current", "page");

    await user.click(nextButton);

    expect(scrollTo).toHaveBeenCalledWith({
      left: 800,
      behavior: "smooth",
    });

    track.scrollLeft = 800;
    fireEvent.scroll(track);

    expect(previousButton).toBeEnabled();
    expect(nextButton).toBeDisabled();
    expect(
      within(carousel).getByRole("button", { name: "Ir para página 2 de 2" }),
    ).toHaveAttribute("aria-current", "page");

    await user.click(
      within(carousel).getByRole("button", { name: "Ir para página 1 de 2" }),
    );

    expect(scrollTo).toHaveBeenLastCalledWith({
      left: 0,
      behavior: "smooth",
    });
  });

  it("permite arrastar com o mouse sem abrir o produto", () => {
    renderWithRouter(
      <PublicProductCarousel label="Destaques" products={products} />,
    );

    const carousel = screen.getByRole("region", {
      name: "Produtos de Destaques",
    });
    const track = within(carousel).getByRole("list");
    const slides = within(track).getAllByRole("listitem");
    const productLink = within(carousel).getByRole("link", {
      name: /Produto 1/i,
    });
    const scrollTo = configureTrack(track, slides);
    const setPointerCapture = vi.mocked(track.setPointerCapture);

    fireEvent.pointerDown(track, {
      pointerId: 1,
      pointerType: "mouse",
      button: 0,
      clientX: 500,
    });
    fireEvent.pointerUp(track, {
      pointerId: 1,
      pointerType: "mouse",
    });

    expect(setPointerCapture).not.toHaveBeenCalled();

    fireEvent.pointerDown(track, {
      pointerId: 1,
      pointerType: "mouse",
      button: 0,
      clientX: 500,
    });
    fireEvent.pointerMove(track, {
      pointerId: 1,
      pointerType: "mouse",
      clientX: 300,
    });

    expect(setPointerCapture).toHaveBeenCalledWith(1);
    expect(track.scrollLeft).toBe(200);

    fireEvent.pointerUp(track, {
      pointerId: 1,
      pointerType: "mouse",
    });

    expect(scrollTo).toHaveBeenCalledWith({
      left: 205,
      behavior: "smooth",
    });
    expect(track.style.scrollSnapType).toBe("none");
    expect(fireEvent.click(productLink)).toBe(false);
  });
});
