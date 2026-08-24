import { screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithRouter } from "../../../test/renderWithRouter";
import type { PublicProduct } from "../../catalog/types/publicCatalog";
import type { PublicHomeSection as PublicHomeSectionType } from "../types/publicHome";
import { PublicHomeSection } from "./PublicHomeSection";

function createProduct(index: number): PublicProduct {
  return {
    id: `produto-${index}`,
    categoriaId: "categoria-1",
    nome: `Produto ${index}`,
    slug: `produto-${index}`,
    descricaoCurta: null,
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

function createSection(productCount: number): PublicHomeSectionType {
  return {
    id: "secao-1",
    titulo: "Destaques",
    subtitulo: "Produtos selecionados.",
    slug: "destaques",
    posicao: 1,
    limiteProdutos: productCount,
    produtos: Array.from({ length: productCount }, (_, index) =>
      createProduct(index + 1),
    ),
  };
}

describe("PublicHomeSection", () => {
  it("mantém uma seção com um produto como grid simples", () => {
    renderWithRouter(<PublicHomeSection section={createSection(1)} />);

    const productList = screen.getByRole("list", {
      name: "Produtos de Destaques",
    });

    expect(within(productList).getAllByRole("listitem")).toHaveLength(1);
    expect(
      screen.queryByRole("region", {
        name: "Produtos de Destaques",
      }),
    ).not.toBeInTheDocument();
  });

  it.each([2, 3, 4])(
    "reutiliza o carrossel responsivo com %i produtos",
    (productCount) => {
      renderWithRouter(
        <PublicHomeSection section={createSection(productCount)} />,
      );

      const carousel = screen.getByRole("region", {
        name: "Produtos de Destaques",
      });

      expect(within(carousel).getAllByRole("listitem")).toHaveLength(
        productCount,
      );
    },
  );

  it("usa carrossel quando a seção possui mais de quatro produtos", () => {
    renderWithRouter(<PublicHomeSection section={createSection(5)} />);

    expect(
      screen.getByRole("region", {
        name: "Produtos de Destaques",
      }),
    ).toBeInTheDocument();
  });
});
