import { screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderWithRouter } from "../../test/renderWithRouter";
import { usePublicSiteSettings } from "../../features/site-settings/context/PublicSiteSettingsContext";
import { PublicHeader } from "./PublicHeader";

vi.mock(
  "../../features/site-settings/context/PublicSiteSettingsContext",
  () => ({
    usePublicSiteSettings: vi.fn(),
  }),
);

const mockedUsePublicSiteSettings = vi.mocked(usePublicSiteSettings);

const reloadMock = vi.fn();

beforeEach(() => {
  reloadMock.mockReset();

  mockedUsePublicSiteSettings.mockReturnValue({
    settings: {
      id: 1,
      nomeMarca: "Conexão e Aromas",
      slogan: "Produtos feitos com carinho",
      whatsapp: "5547999999999",
      instagram: "@conexaoearomas",
      email: "contato@conexaoearomas.com.br",
      endereco: "Rua de exemplo, 100",
      textoSobre: "Texto sobre a marca.",
      textoContato: "Entre em contato conosco.",
      logoPath: "marca/logo-exemplo.webp",
      bannerPath: "marca/banner-exemplo.webp",
      logoUrl: "https://example.com/logo.webp",
      bannerUrl: "https://example.com/banner.webp",
      updatedAt: "2026-08-05T12:00:00.000Z",
    },
    isLoading: false,
    loadError: null,
    reload: reloadMock,
  });
});

describe("PublicHeader", () => {
  it("exibe a identidade e a navegação da marca", () => {
    renderWithRouter(<PublicHeader />);

    const brandLink = screen.getByRole("link", {
      name: "Conexão e Aromas — página inicial",
    });

    expect(brandLink).toHaveAttribute("href", "/");

    const logo = brandLink.querySelector("img");

    expect(logo).not.toBeNull();

    expect(logo).toHaveAttribute("src", "https://example.com/logo.webp");

    expect(logo).toHaveAttribute("alt", "");

    const navigation = screen.getByRole("navigation", {
      name: "Navegação principal",
    });

    expect(
      within(navigation).getByRole("link", {
        name: "Início",
      }),
    ).toHaveAttribute("href", "/");

    expect(
      within(navigation).getByRole("link", {
        name: "Catálogo",
      }),
    ).toHaveAttribute("href", "/catalogo");

    expect(
      within(navigation).getByRole("link", {
        name: "Sobre",
      }),
    ).toHaveAttribute("href", "/sobre");
  });

  it("exibe o botão do WhatsApp", () => {
    renderWithRouter(<PublicHeader />);

    const whatsappLinks = screen.getAllByRole("link", {
      name: "Falar pelo WhatsApp",
    });

    expect(whatsappLinks.length).toBeGreaterThan(0);

    expect(whatsappLinks[0]).toHaveAttribute(
      "href",
      expect.stringContaining("wa.me/5547999999999"),
    );
  });

  it("abre e fecha o menu mobile", async () => {
    const { user } = renderWithRouter(<PublicHeader />);

    const openButton = screen.getByRole("button", {
      name: "Abrir menu principal",
    });

    await user.click(openButton);

    expect(
      screen.getByRole("navigation", {
        name: "Navegação para dispositivos móveis",
      }),
    ).toBeInTheDocument();

    const closeButton = screen.getByRole("button", {
      name: "Fechar menu principal",
    });

    await user.click(closeButton);

    expect(
      screen.queryByRole("navigation", {
        name: "Navegação para dispositivos móveis",
      }),
    ).not.toBeInTheDocument();
  });

  it("fecha o menu mobile pela tecla Escape", async () => {
    const { user } = renderWithRouter(<PublicHeader />);

    await user.click(
      screen.getByRole("button", {
        name: "Abrir menu principal",
      }),
    );

    expect(
      screen.getByRole("navigation", {
        name: "Navegação para dispositivos móveis",
      }),
    ).toBeInTheDocument();

    await user.keyboard("{Escape}");

    expect(
      screen.queryByRole("navigation", {
        name: "Navegação para dispositivos móveis",
      }),
    ).not.toBeInTheDocument();
  });
});
