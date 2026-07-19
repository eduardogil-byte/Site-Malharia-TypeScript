import { createBrowserRouter } from "react-router";
import { AdminDashboardPage } from "../pages/admin/AdminDashboardPage";
import { AdminLoginPage } from "../pages/admin/AdminLoginPage";
import { AdminPlaceholderPage } from "../pages/admin/AdminPlaceholderPage";
import { NotFoundPage } from "../pages/NotFoundPage";
import { AboutPage } from "../pages/public/AboutPage";
import { CatalogPage } from "../pages/public/CatalogPage";
import { ContactPage } from "../pages/public/ContactPage";
import { HomePage } from "../pages/public/HomePage";
import { ProductPage } from "../pages/public/ProductPage";
import { AdminLayout } from "../shared/layouts/AdminLayout";
import { PublicLayout } from "../shared/layouts/PublicLayout";
import { AdminProtectedRoute } from "../features/auth/components/AdminProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "catalogo",
        element: <CatalogPage />,
      },
      {
        path: "produto/:slug",
        element: <ProductPage />,
      },
      {
        path: "sobre",
        element: <AboutPage />,
      },
      {
        path: "contato",
        element: <ContactPage />,
      },
    ],
  },
  {
    path: "/admin/login",
    element: <AdminLoginPage />,
  },
  {
    path: "/admin/login",
    element: <AdminLoginPage />,
  },
  {
    element: <AdminProtectedRoute />,
    children: [
      {
        path: "/admin",
        element: <AdminLayout />,
        children: [
          {
            index: true,
            element: <AdminDashboardPage />,
          },
          {
            path: "produtos",
            element: (
              <AdminPlaceholderPage
                title="Produtos"
                description="Cadastre, edite, publique e arquive produtos."
              />
            ),
          },
          {
            path: "categorias",
            element: (
              <AdminPlaceholderPage
                title="Categorias"
                description="Organize os diferentes tipos de produtos."
              />
            ),
          },
          {
            path: "pagina-inicial",
            element: (
              <AdminPlaceholderPage
                title="Página inicial"
                description="Escolha as seções, os destaques e a ordem dos produtos."
              />
            ),
          },
          {
            path: "configuracoes",
            element: (
              <AdminPlaceholderPage
                title="Configurações"
                description="Altere os dados da marca, WhatsApp e redes sociais."
              />
            ),
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
