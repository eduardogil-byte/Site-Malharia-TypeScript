import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ResponsiveTableRegion } from "./ResponsiveTableRegion";

describe("ResponsiveTableRegion", () => {
  it("cria uma região acessível para a tabela", () => {
    render(
      <ResponsiveTableRegion label="Lista de produtos">
        <table>
          <tbody>
            <tr>
              <td>Malha floral</td>
            </tr>
          </tbody>
        </table>
      </ResponsiveTableRegion>,
    );

    const region = screen.getByRole("region", {
      name: "Lista de produtos",
    });

    expect(region).toBeInTheDocument();
    expect(region).toHaveAttribute("tabindex", "0");

    expect(screen.getByText("Malha floral")).toBeInTheDocument();
  });

  it("aceita classes adicionais", () => {
    render(
      <ResponsiveTableRegion
        label="Categorias"
        className="classe-personalizada"
      >
        <div>Conteúdo</div>
      </ResponsiveTableRegion>,
    );

    expect(
      screen.getByRole("region", {
        name: "Categorias",
      }),
    ).toHaveClass("classe-personalizada");
  });
});
