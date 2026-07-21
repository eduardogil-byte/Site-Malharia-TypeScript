import { Outlet } from "react-router";
import { PublicFooter } from "../../components/public/PublicFooter";
import { PublicHeader } from "../../components/public/PublicHeader";
import { PublicSiteSettingsProvider } from "../../features/site-settings/context/PublicSiteSettingsContext";

function PublicLayoutContent() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-stone-950">
      <PublicHeader />

      <div className="flex-1">
        <Outlet />
      </div>

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
