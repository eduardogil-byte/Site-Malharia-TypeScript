import { createBrowserRouter } from "react-router";
import { AdminDashboardPage } from "../pages/admin/AdminDashboardPage";
import { AdminLoginPage } from "../pages/admin/AdminLoginPage";
import { NotFoundPage } from "../pages/NotFoundPage";
import { AboutPage } from "../pages/public/AboutPage";
import { CatalogPage } from "../pages/public/CatalogPage";
import { ContactPage } from "../pages/public/ContactPage";
import { HomePage } from "../pages/public/HomePage";
import { ProductPage } from "../pages/public/ProductPage";
import { AdminLayout } from "../shared/layouts/AdminLayout";
import { PublicLayout } from "../shared/layouts/PublicLayout";
import { AdminProtectedRoute } from "../features/auth/components/AdminProtectedRoute";
import { CategoriesPage } from "../pages/admin/CategoriesPage";
import { ProductsPage } from "../pages/admin/ProductsPage";
import { ProductFormPage } from "../pages/admin/ProductFormPage";
import { HomeSectionsPage } from "../pages/admin/HomeSectionsPage";
import { HomeSectionProductsPage } from "../pages/admin/HomeSectionProductsPage";
import { SiteSettingsPage } from "../pages/admin/SiteSettingsPage";

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
            element: <ProductsPage />,
          },
          {
            path: "produtos/novo",
            element: <ProductFormPage />,
          },
          {
            path: "produtos/:productId/editar",
            element: <ProductFormPage />,
          },
          {
            path: "categorias",
            element: <CategoriesPage />,
          },
          {
            path: "pagina-inicial",
            element: <HomeSectionsPage />,
          },
          {
            path: "pagina-inicial/:sectionId/produtos",
            element: <HomeSectionProductsPage />,
          },
          {
            path: "configuracoes",
            element: <SiteSettingsPage />,
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
