import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SkipLink } from "./SkipLink";

describe("SkipLink", () => {
  it("usa o conteúdo principal como destino padrão", () => {
    render(<SkipLink />);

    const link = screen.getByRole("link", {
      name: "Pular para o conteúdo",
    });

    expect(link).toBeInTheDocument();

    expect(link).toHaveAttribute("href", "#main-content");
  });

  it("aceita um destino e um texto personalizados", () => {
    render(
      <SkipLink
        targetId="admin-main-content"
        label="Pular para o conteúdo administrativo"
      />,
    );

    const link = screen.getByRole("link", {
      name: "Pular para o conteúdo administrativo",
    });

    expect(link).toHaveAttribute("href", "#admin-main-content");
  });
});
