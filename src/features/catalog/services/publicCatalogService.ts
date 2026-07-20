import type { Json } from "../../../types/database.types";
import { supabase } from "../../../lib/supabase";
import { PRODUCT_IMAGES_BUCKET } from "../../../shared/constants/storage";
import type {
  PublicCatalogFilters,
  PublicCategory,
  PublicProduct,
  PublicProductCategory,
  PublicProductImage,
  PublicSiteSettings,
} from "../types/publicCatalog";

type ProductImageDatabaseRow = {
  id: string;
  storage_path: string;
  alt_text: string | null;
  posicao: number;
};

type ProductDatabaseRow = {
  id: string;
  categoria_id: string;
  nome: string;
  slug: string;
  descricao_curta: string | null;
  descricao: string | null;
  disponivel: boolean;
  atributos: Json;
  mensagem_whatsapp: string | null;
  categoria: PublicProductCategory | null;
  imagens: ProductImageDatabaseRow[] | null;
};

export class PublicCatalogError extends Error {
  constructor(message = "Não foi possível carregar o catálogo.") {
    super(message);
    this.name = "PublicCatalogError";
  }
}

function getPublicImageUrl(storagePath: string): string {
  const { data } = supabase.storage
    .from(PRODUCT_IMAGES_BUCKET)
    .getPublicUrl(storagePath);

  return data.publicUrl;
}

function mapProductImage(image: ProductImageDatabaseRow): PublicProductImage {
  return {
    id: image.id,
    storagePath: image.storage_path,
    altText: image.alt_text,
    posicao: image.posicao,
    publicUrl: getPublicImageUrl(image.storage_path),
  };
}

function mapPublicProduct(product: ProductDatabaseRow): PublicProduct {
  const images = (product.imagens ?? [])
    .slice()
    .sort((firstImage, secondImage) => firstImage.posicao - secondImage.posicao)
    .map(mapProductImage);

  return {
    id: product.id,
    categoriaId: product.categoria_id,
    nome: product.nome,
    slug: product.slug,
    descricaoCurta: product.descricao_curta,
    descricao: product.descricao,
    disponivel: product.disponivel,
    atributos: product.atributos,
    mensagemWhatsapp: product.mensagem_whatsapp,
    categoria: product.categoria,
    imagens: images,
  };
}

export async function listPublicCategories(): Promise<PublicCategory[]> {
  const { data, error } = await supabase
    .from("categorias")
    .select(
      `
      id,
      nome,
      slug,
      descricao,
      posicao
    `,
    )
    .eq("ativa", true)
    .order("posicao", {
      ascending: true,
    });

  if (error) {
    console.error("Erro ao carregar categorias públicas:", error);

    throw new PublicCatalogError("Não foi possível carregar as categorias.");
  }

  return data;
}

export async function listPublicProducts(
  filters: PublicCatalogFilters,
): Promise<PublicProduct[]> {
  let query = supabase
    .from("produtos")
    .select(
      `
      id,
      categoria_id,
      nome,
      slug,
      descricao_curta,
      descricao,
      disponivel,
      atributos,
      mensagem_whatsapp,
      categoria:categorias!produtos_categoria_id_fkey (
        id,
        nome,
        slug
      ),
      imagens:produto_imagens!produto_imagens_produto_id_fkey (
        id,
        storage_path,
        alt_text,
        posicao
      )
    `,
    )
    .eq("status", "publicado")
    .order("nome", {
      ascending: true,
    });

  const searchTerm = filters.search.trim();

  if (searchTerm) {
    query = query.ilike("nome", `%${searchTerm}%`);
  }

  if (filters.categoryId) {
    query = query.eq("categoria_id", filters.categoryId);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Erro ao carregar produtos públicos:", error);

    throw new PublicCatalogError();
  }

  return (data as unknown as ProductDatabaseRow[]).map(mapPublicProduct);
}

export async function getPublicProductBySlug(
  slug: string,
): Promise<PublicProduct | null> {
  const { data, error } = await supabase
    .from("produtos")
    .select(
      `
      id,
      categoria_id,
      nome,
      slug,
      descricao_curta,
      descricao,
      disponivel,
      atributos,
      mensagem_whatsapp,
      categoria:categorias!produtos_categoria_id_fkey (
        id,
        nome,
        slug
      ),
      imagens:produto_imagens!produto_imagens_produto_id_fkey (
        id,
        storage_path,
        alt_text,
        posicao
      )
    `,
    )
    .eq("slug", slug)
    .eq("status", "publicado")
    .maybeSingle();

  if (error) {
    console.error("Erro ao carregar produto público:", error);

    throw new PublicCatalogError("Não foi possível carregar o produto.");
  }

  if (!data) {
    return null;
  }

  return mapPublicProduct(data as unknown as ProductDatabaseRow);
}

export async function getPublicSiteSettings(): Promise<PublicSiteSettings | null> {
  const { data, error } = await supabase
    .from("configuracoes_site")
    .select(
      `
      nome_marca,
      whatsapp
    `,
    )
    .eq("id", 1)
    .maybeSingle();

  if (error) {
    console.error("Erro ao carregar configurações públicas:", error);

    throw new PublicCatalogError(
      "Não foi possível carregar os dados de contato.",
    );
  }

  if (!data) {
    return null;
  }

  return {
    nomeMarca: data.nome_marca,
    whatsapp: data.whatsapp,
  };
}
