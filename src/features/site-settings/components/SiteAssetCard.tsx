import { useRef, useState, type ChangeEvent } from "react";

type SiteAssetCardProps = {
  title: string;
  description: string;
  imageUrl: string | null;
  isBusy: boolean;
  disabled: boolean;
  onUpload: (file: File) => Promise<void>;
  onRemove: () => Promise<void>;
};

export function SiteAssetCard({
  title,
  description,
  imageUrl,
  isBusy,
  disabled,
  onUpload,
  onRemove,
}: SiteAssetCardProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setSelectedFile(event.target.files?.[0] ?? null);
  }

  async function handleUpload() {
    if (!selectedFile) {
      return;
    }

    await onUpload(selectedFile);

    setSelectedFile(null);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  return (
    <article className="rounded-2xl border border-stone-200 bg-white p-6">
      <h2 className="text-xl font-semibold text-stone-950">{title}</h2>

      <p className="mt-1 text-sm leading-6 text-stone-600">{description}</p>

      <div className="mt-5 overflow-hidden rounded-xl border border-stone-200 bg-stone-100">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="h-56 w-full object-contain"
          />
        ) : (
          <div className="flex h-56 items-center justify-center p-6 text-center text-sm text-stone-500">
            Nenhuma imagem configurada
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleChange}
        disabled={disabled}
        className="mt-5 block w-full text-sm text-stone-600 file:mr-4 file:rounded-lg file:border-0 file:bg-stone-900 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white disabled:opacity-50"
      />

      <p className="mt-2 text-xs text-stone-500">
        JPEG, PNG ou WebP. Máximo de 5 MB.
      </p>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => void handleUpload()}
          disabled={disabled || !selectedFile}
          className="rounded-lg bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isBusy
            ? "Enviando..."
            : imageUrl
              ? "Substituir imagem"
              : "Enviar imagem"}
        </button>

        {imageUrl && (
          <button
            type="button"
            onClick={() => void onRemove()}
            disabled={disabled}
            className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-40"
          >
            Remover imagem
          </button>
        )}
      </div>
    </article>
  );
}
