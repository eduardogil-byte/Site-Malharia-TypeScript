import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import {
  deleteProductImage,
  listProductImages,
  MAX_PRODUCT_IMAGES,
  uploadProductImages,
} from "../services/productImageService";
import type { ProductImage } from "../types/productImage";

type ProductImagesManagerProps = {
  productId: string;
};

export function ProductImagesManager({ productId }: ProductImagesManagerProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [images, setImages] = useState<ProductImage[]>([]);

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  const [isUploading, setIsUploading] = useState(false);

  const [deletingImageId, setDeletingImageId] = useState<string | null>(null);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const loadImages = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const data = await listProductImages(productId);

      setImages(data);
    } catch (error) {
      console.error("Erro ao carregar imagens:", error);

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Não foi possível carregar as imagens.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    void loadImages();
  }, [loadImages]);

  function handleFilesChange(event: ChangeEvent<HTMLInputElement>) {
    setErrorMessage(null);
    setSuccessMessage(null);

    const files = Array.from(event.target.files ?? []);

    setSelectedFiles(files);
  }

  async function handleUpload() {
    if (isUploading) {
      return;
    }

    setErrorMessage(null);
    setSuccessMessage(null);
    setIsUploading(true);

    try {
      await uploadProductImages(productId, selectedFiles, images.length);

      setSelectedFiles([]);

      if (inputRef.current) {
        inputRef.current.value = "";
      }

      await loadImages();

      setSuccessMessage("Imagens enviadas com sucesso.");
    } catch (error) {
      console.error("Erro ao enviar imagens:", error);

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Não foi possível enviar as imagens.",
      );
    } finally {
      setIsUploading(false);
    }
  }

  async function handleDelete(image: ProductImage) {
    const confirmed = window.confirm(
      image.posicao === 1
        ? "Esta é a imagem de capa. Deseja excluí-la? A próxima imagem se tornará a capa."
        : "Deseja excluir esta imagem?",
    );

    if (!confirmed) {
      return;
    }

    setErrorMessage(null);
    setSuccessMessage(null);
    setDeletingImageId(image.id);

    try {
      await deleteProductImage(image);
      await loadImages();

      setSuccessMessage("Imagem excluída com sucesso.");
    } catch (error) {
      console.error("Erro ao excluir imagem:", error);

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Não foi possível excluir a imagem.",
      );
    } finally {
      setDeletingImageId(null);
    }
  }

  const remainingSlots = MAX_PRODUCT_IMAGES - images.length;

  return (
    <section className="rounded-2xl border border-stone-200 bg-white p-6">
      <div>
        <h2 className="text-xl font-semibold text-stone-950">
          Imagens do produto
        </h2>

        <p className="mt-1 text-sm leading-6 text-stone-600">
          Envie até {MAX_PRODUCT_IMAGES} imagens. A primeira imagem será
          utilizada como capa do produto.
        </p>
      </div>

      {successMessage && (
        <div
          role="status"
          className="mt-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800"
        >
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div
          role="alert"
          className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          {errorMessage}
        </div>
      )}

      <div className="mt-6 rounded-xl border border-dashed border-stone-300 p-5">
        <label
          htmlFor="product-images"
          className="block text-sm font-medium text-stone-700"
        >
          Selecionar imagens
        </label>

        <input
          ref={inputRef}
          id="product-images"
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFilesChange}
          disabled={isUploading || remainingSlots === 0}
          className="mt-3 block w-full text-sm text-stone-600 file:mr-4 file:rounded-lg file:border-0 file:bg-stone-900 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-stone-700 disabled:opacity-50"
        />

        <p className="mt-3 text-xs text-stone-500">
          JPEG, PNG ou WebP. Máximo de 5 MB por arquivo. Restam {remainingSlots}{" "}
          espaços.
        </p>

        {selectedFiles.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-medium text-stone-700">
              Arquivos selecionados:
            </p>

            <ul className="mt-2 space-y-1 text-sm text-stone-600">
              {selectedFiles.map((file) => (
                <li key={`${file.name}-${file.lastModified}`}>{file.name}</li>
              ))}
            </ul>

            <button
              type="button"
              onClick={() => void handleUpload()}
              disabled={isUploading}
              className="mt-4 rounded-lg bg-stone-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isUploading
                ? "Enviando..."
                : `Enviar ${selectedFiles.length} imagem(ns)`}
            </button>
          </div>
        )}
      </div>

      <div className="mt-6">
        {isLoading && (
          <div className="rounded-lg bg-stone-50 p-8 text-center text-sm text-stone-600">
            Carregando imagens...
          </div>
        )}

        {!isLoading && images.length === 0 && (
          <div className="rounded-lg border border-dashed border-stone-300 p-8 text-center text-sm text-stone-500">
            Nenhuma imagem cadastrada.
          </div>
        )}

        {!isLoading && images.length > 0 && (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {images.map((image) => (
              <article
                key={image.id}
                className="overflow-hidden rounded-xl border border-stone-200"
              >
                <div className="relative aspect-square bg-stone-100">
                  <img
                    src={image.publicUrl}
                    alt={image.alt_text ?? "Imagem do produto"}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />

                  {image.posicao === 1 && (
                    <span className="absolute left-3 top-3 rounded-full bg-stone-950 px-3 py-1 text-xs font-medium text-white">
                      Capa
                    </span>
                  )}
                </div>

                <div className="p-4">
                  <p className="text-sm font-medium text-stone-900">
                    Imagem {image.posicao}
                  </p>

                  {image.alt_text && (
                    <p className="mt-1 truncate text-xs text-stone-500">
                      {image.alt_text}
                    </p>
                  )}

                  <button
                    type="button"
                    onClick={() => void handleDelete(image)}
                    disabled={deletingImageId === image.id}
                    className="mt-4 w-full rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {deletingImageId === image.id
                      ? "Excluindo..."
                      : "Excluir imagem"}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
