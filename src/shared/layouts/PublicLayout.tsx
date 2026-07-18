import { Outlet } from "react-router";
import { Footer } from "../components/navigation/Footer";
import { Header } from "../components/navigation/Header";

export function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-stone-50 text-stone-900">
      <Header />

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
