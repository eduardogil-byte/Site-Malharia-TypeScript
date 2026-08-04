import { Outlet } from "react-router";
import { PublicFooter } from "../../components/public/PublicFooter";
import { PublicHeader } from "../../components/public/PublicHeader";
import { PublicSiteSettingsProvider } from "../../features/site-settings/context/PublicSiteSettingsContext";
import { RouteFocusManager } from "../components/RouteFocusManager";
import { SkipLink } from "../components/SkipLink";

function PublicLayoutContent() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-stone-950">
      <SkipLink />

      <RouteFocusManager />

      <PublicHeader />

      <main
        id="main-content"
        tabIndex={-1}
        className="flex-1 outline-none"
      >
        <Outlet />
      </main>

      <PublicFooter />
    </div>
  );
}

export function PublicLayout() {
  return (
    <PublicSiteSettingsProvider>
      <PublicLayoutContent />
    </PublicSiteSettingsProvider>
  );
}