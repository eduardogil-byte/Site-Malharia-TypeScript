import type { PostgrestError } from "@supabase/supabase-js";
import { supabase } from "../../../lib/supabase";
import type { ProductImage } from "../types/productImage";

export const PRODUCT_IMAGES_BUCKET = "catalogo-produtos";

export const MAX_PRODUCT_IMAGES = 8;

export const MAX_PRODUCT_IMAGE_SIZE = 5 * 1024 * 1024;

const imageExtensions: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export class ProductImageValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ProductImageValidationError";
  }
}

export class ProductImagePersistenceError extends Error {
  constructor(message = "Não foi possível realizar a operação com a imagem.") {
    super(message);
    this.name = "ProductImagePersistenceError";
  }
}

function mapDatabaseError(error: PostgrestError): Error {
  console.error("Erro do banco ao manipular imagem:", error);

  switch (error.code) {
    case "42501":
      return new ProductImagePersistenceError(
        "Você não possui permissão para gerenciar imagens.",
      );

    case "P0002":
      return new ProductImagePersistenceError(
        "A imagem ou o produto não foi encontrado.",
      );

    case "22023":
      return new ProductImagePersistenceError(
        error.message || "Os dados da imagem são inválidos.",
      );

    case "23505":
      return new ProductImagePersistenceError(
        "Esta imagem já está cadastrada.",
      );

    default:
      return new ProductImagePersistenceError();
  }
}

export function validateProductImage(file: File): void {
  if (!imageExtensions[file.type]) {
    throw new ProductImageValidationError(
      `O arquivo "${file.name}" não possui um formato permitido.`,
    );
  }

  if (file.size > MAX_PRODUCT_IMAGE_SIZE) {
    throw new ProductImageValidationError(
      `O arquivo "${file.name}" ultrapassa o limite de 5 MB.`,
    );
  }

  if (file.size === 0) {
    throw new ProductImageValidationError(
      `O arquivo "${file.name}" está vazio.`,
    );
  }
}

function createStoragePath(productId: string, file: File): string {
  const extension = imageExtensions[file.type];

  return ["produtos", productId, `${crypto.randomUUID()}.${extension}`].join(
    "/",
  );
}

function getPublicUrl(storagePath: string): string {
  const { data } = supabase.storage
    .from(PRODUCT_IMAGES_BUCKET)
    .getPublicUrl(storagePath);

  return data.publicUrl;
}

export async function listProductImages(
  productId: string,
): Promise<ProductImage[]> {
  const { data, error } = await supabase
    .from("produto_imagens")
    .select("*")
    .eq("produto_id", productId)
    .order("posicao", {
      ascending: true,
    });

  if (error) {
    throw mapDatabaseError(error);
  }

  return data.map((image) => ({
    ...image,
    publicUrl: getPublicUrl(image.storage_path),
  }));
}

async function registerProductImage(
  productId: string,
  storagePath: string,
  altText: string,
): Promise<void> {
  const { error } = await supabase.rpc("registrar_imagem_produto", {
    p_produto_id: productId,
    p_storage_path: storagePath,
    p_alt_text: altText || undefined, //aqui foi necessario mudar de null para undefined, pois estava com erro
  });

  if (error) {
    throw mapDatabaseError(error);
  }
}

export async function uploadProductImages(
  productId: string,
  files: File[],
  existingImagesCount: number,
): Promise<void> {
  if (files.length === 0) {
    throw new ProductImageValidationError("Selecione pelo menos uma imagem.");
  }

  if (existingImagesCount + files.length > MAX_PRODUCT_IMAGES) {
    throw new ProductImageValidationError(
      `O produto pode possuir no máximo ${MAX_PRODUCT_IMAGES} imagens.`,
    );
  }

  files.forEach(validateProductImage);

  /*
   * Enviamos sequencialmente para que as posições sejam
   * registradas na mesma ordem em que os arquivos foram
   * selecionados.
   */
  for (const file of files) {
    const storagePath = createStoragePath(productId, file);

    const { error: uploadError } = await supabase.storage
      .from(PRODUCT_IMAGES_BUCKET)
      .upload(storagePath, file, {
        cacheControl: "31536000",
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("Erro no upload da imagem:", uploadError);

      throw new ProductImagePersistenceError(
        `Não foi possível enviar "${file.name}".`,
      );
    }

    try {
      await registerProductImage(productId, storagePath, file.name);
    } catch (error) {
      /*
       * Se o registro no banco falhar, removemos o arquivo
       * recém-enviado para evitar um objeto órfão.
       */
      const { error: cleanupError } = await supabase.storage
        .from(PRODUCT_IMAGES_BUCKET)
        .remove([storagePath]);

      if (cleanupError) {
        console.error(
          "Não foi possível remover o arquivo após falha:",
          cleanupError,
        );
      }

      throw error;
    }
  }
}

export async function deleteProductImage(image: ProductImage): Promise<void> {
  /*
   * Arquivos devem ser removidos pela API do Storage, e não
   * apagando diretamente registros de storage.objects.
   */
  const { error: storageError } = await supabase.storage
    .from(PRODUCT_IMAGES_BUCKET)
    .remove([image.storage_path]);

  if (storageError) {
    console.error("Erro ao remover arquivo do Storage:", storageError);

    throw new ProductImagePersistenceError(
      "Não foi possível excluir o arquivo da imagem.",
    );
  }

  const { error: databaseError } = await supabase.rpc(
    "excluir_imagem_produto",
    {
      p_imagem_id: image.id,
    },
  );

  if (databaseError) {
    throw mapDatabaseError(databaseError);
  }
}

export async function reorderProductImages(
  productId: string,
  imageIds: string[],
): Promise<void> {
  if (imageIds.length === 0) {
    throw new ProductImageValidationError(
      "A lista de imagens não pode estar vazia.",
    );
  }

  const { error } = await supabase.rpc("reordenar_imagens_produto", {
    p_produto_id: productId,
    p_imagem_ids: imageIds,
  });

  if (error) {
    throw mapDatabaseError(error);
  }
}
