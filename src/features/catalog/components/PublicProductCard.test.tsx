import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithRouter } from "../../../test/renderWithRouter";
import type { PublicProduct } from "../types/publicCatalog";
import { PublicProductCard } from "./PublicProductCard";

const availableProduct: PublicProduct = {
  id: "produto-1",
  categoriaId: "categoria-1",
  nome: "Malha Floral Azul",
  slug: "malha-floral-azul",
  descricaoCurta: "Malha confortável com estampa floral.",
  descricao: "Descrição completa da malha.",
  disponivel: true,
  atributos: {
    material: "Algodão",
  },
  mensagemWhatsapp: null,

  categoria: {
    id: "categoria-1",
    nome: "Malhas",
    slug: "malhas",
  },

  imagens: [
    {
      id: "imagem-1",
      storagePath: "produtos/produto-1/imagem.webp",
      altText: "Malha azul com flores",
      posicao: 1,
      publicUrl: "https://example.com/malha.webp",
    },
  ],
};

describe("PublicProductCard", () => {
  it("exibe as informações do produto", () => {
    renderWithRouter(<PublicProductCard product={availableProduct} />);

    expect(screen.getByText("Malha Floral Azul")).toBeInTheDocument();

    expect(screen.getByText("Malhas")).toBeInTheDocument();

    expect(
      screen.getByText("Malha confortável com estampa floral."),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("img", {
        name: "Malha azul com flores",
      }),
    ).toHaveAttribute("src", "https://example.com/malha.webp");
  });

  it("direciona para a página individual do produto", () => {
    renderWithRouter(<PublicProductCard product={availableProduct} />);

    const link = screen.getByRole("link", {
      name: /Malha Floral Azul/i,
    });

    expect(link).toHaveAttribute("href", "/produto/malha-floral-azul");
  });

  it("informa quando o produto está indisponível", () => {
    renderWithRouter(
      <PublicProductCard
        product={{
          ...availableProduct,
          disponivel: false,
        }}
      />,
    );

    expect(screen.getByText(/indisponível/i)).toBeInTheDocument();
  });
});
