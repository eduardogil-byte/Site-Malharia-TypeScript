import { useEffect, useState } from "react";
import type { PublicProductImage } from "../types/publicCatalog";

type PublicProductGalleryProps = {
  productName: string;
  images: PublicProductImage[];
};

export function PublicProductGallery({
  productName,
  images,
}: PublicProductGalleryProps) {
  const [selectedImageId, setSelectedImageId] = useState<string | null>(
    images[0]?.id ?? null,
  );

  useEffect(() => {
    setSelectedImageId(images[0]?.id ?? null);
  }, [images]);

  const selectedImage =
    images.find((image) => image.id === selectedImageId) ?? images[0];

  if (!selectedImage) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-2xl bg-stone-100 p-8 text-center text-stone-500">
        Produto sem imagens
      </div>
    );
  }

  return (
    <div>
      <div className="aspect-square overflow-hidden rounded-2xl bg-stone-100">
        <img
          src={selectedImage.publicUrl}
          alt={selectedImage.altText ?? productName}
          className="h-full w-full object-cover"
        />
      </div>

      {images.length > 1 && (
        <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-5">
          {images.map((image) => {
            const isSelected = image.id === selectedImage.id;

            return (
              <button
                key={image.id}
                type="button"
                onClick={() => setSelectedImageId(image.id)}
                aria-label={`Visualizar imagem ${image.posicao} de ${productName}`}
                className={[
                  "aspect-square overflow-hidden rounded-lg border-2 bg-stone-100 transition",
                  isSelected
                    ? "border-stone-900"
                    : "border-transparent hover:border-stone-400",
                ].join(" ")}
              >
                <img
                  src={image.publicUrl}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
