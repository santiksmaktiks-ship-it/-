import { useState } from "react";
import TopBar, { type TabId } from "./components/TopBar";
import HomePage from "./pages/HomePage";
import NewsPage from "./pages/NewsPage";
import SettingsPage from "./pages/SettingsPage";
import ModsPage from "./pages/ModsPage";
import ProfilePage from "./pages/ProfilePage";

export default function App() {
  const [tab, setTab] = useState<TabId>("home");

  return (
    <div className="h-screen w-screen bg-app-bg text-white overflow-hidden flex flex-col">
      <TopBar active={tab} onChange={setTab} />
      <main className="flex-1 min-h-0 px-6 pb-6 pt-2">
        {tab === "home" && <HomePage />}
        {tab === "news" && <NewsPage />}
        {tab === "settings" && <SettingsPage />}
        {tab === "mods" && <ModsPage />}
        {tab === "profile" && <ProfilePage />}
      </main>
    </div>
  );
}
