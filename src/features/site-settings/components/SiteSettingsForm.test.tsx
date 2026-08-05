import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { SiteSettings } from "../types/siteSettings";
import { SiteSettingsForm } from "./SiteSettingsForm";

const settings: SiteSettings = {
  id: 1,
  nomeMarca: "Conexão e Aromas",
  slogan: "Produtos feitos com carinho",
  whatsapp: "5547999999999",
  instagram: "@conexaoearomas",
  email: "contato@conexaoearomas.com.br",
  endereco: "Rua de exemplo, 100",
  textoSobre: "Texto institucional da marca.",
  textoContato: "Entre em contato conosco.",
  logoPath: "marca/logo-exemplo.webp",
  bannerPath: "marca/banner-exemplo.webp",
  logoUrl: "https://example.com/logo.webp",
  bannerUrl: "https://example.com/banner.webp",
  updatedAt: "2026-08-05T12:00:00.000Z",
};

describe("SiteSettingsForm", () => {
  it("carrega os valores existentes", () => {
    render(
      <SiteSettingsForm
        settings={settings}
        isSubmitting={false}
        onSubmit={vi.fn()}
      />,
    );

    expect(screen.getByLabelText("Nome da marca")).toHaveValue(
      "Conexão e Aromas",
    );

    expect(screen.getByLabelText("WhatsApp")).toHaveValue("5547999999999");

    expect(screen.getByLabelText("Instagram")).toHaveValue("@conexaoearomas");
  });

  it("envia valores válidos", async () => {
    const user = userEvent.setup();

    const handleSubmit = vi.fn().mockResolvedValue(undefined);

    render(
      <SiteSettingsForm
        settings={settings}
        isSubmitting={false}
        onSubmit={handleSubmit}
      />,
    );

    const brandNameInput = screen.getByLabelText("Nome da marca");

    await user.clear(brandNameInput);

    await user.type(brandNameInput, "Nova Marca");

    await user.click(
      screen.getByRole("button", {
        name: "Salvar configurações",
      }),
    );

    expect(handleSubmit).toHaveBeenCalledTimes(1);

    expect(handleSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        nomeMarca: "Nova Marca",
        whatsapp: "5547999999999",
      }),
    );
  });

  it("não envia um nome de marca inválido", async () => {
    const user = userEvent.setup();

    const handleSubmit = vi.fn();

    render(
      <SiteSettingsForm
        settings={settings}
        isSubmitting={false}
        onSubmit={handleSubmit}
      />,
    );

    const brandNameInput = screen.getByLabelText("Nome da marca");

    await user.clear(brandNameInput);

    await user.type(brandNameInput, "A");

    await user.click(
      screen.getByRole("button", {
        name: "Salvar configurações",
      }),
    );

    expect(
      await screen.findByText(/pelo menos 2 caracteres/i),
    ).toBeInTheDocument();

    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it("desabilita o botão enquanto está salvando", () => {
    render(
      <SiteSettingsForm settings={settings} isSubmitting onSubmit={vi.fn()} />,
    );

    expect(
      screen.getByRole("button", {
        name: "Salvando...",
      }),
    ).toBeDisabled();
  });
});
