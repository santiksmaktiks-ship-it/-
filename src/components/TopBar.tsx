import { Home, Newspaper, Settings, Package, User } from "lucide-react";
import type { ComponentType, SVGProps } from "react";

export type TabId = "home" | "news" | "settings" | "mods" | "profile";

type Tab = {
  id: TabId;
  label: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
};

const TABS: Tab[] = [
  { id: "home", label: "Главная", Icon: Home },
  { id: "news", label: "Новости", Icon: Newspaper },
  { id: "settings", label: "Настройки", Icon: Settings },
  { id: "mods", label: "Моды", Icon: Package },
  { id: "profile", label: "Профиль", Icon: User },
];

type Props = {
  active: TabId;
  onChange: (id: TabId) => void;
};

export default function TopBar({ active, onChange }: Props) {
  return (
    <header className="h-16 px-6 flex items-center justify-between select-none">
      <div className="flex items-center gap-3 w-[300px]">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center font-bold text-white shadow-[0_4px_14px_rgba(59,130,246,0.5)]">
          <span className="text-lg italic">N</span>
        </div>
      </div>

      <nav className="flex-1 flex items-center justify-center">
        <ul className="flex items-center gap-1 bg-white/[0.03] border border-white/5 rounded-2xl p-1">
          {TABS.map((tab) => {
            const isActive = tab.id === active;
            const Icon = tab.Icon;
            return (
              <li key={tab.id}>
                <button
                  type="button"
                  onClick={() => onChange(tab.id)}
                  aria-current={isActive ? "page" : undefined}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-colors ${
                    isActive
                      ? "bg-accent text-white shadow-[0_6px_18px_rgba(59,130,246,0.45)]"
                      : "text-white/70 hover:text-white hover:bg-white/[0.04]"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="flex items-center justify-end gap-2 w-[300px]">
        <button
          type="button"
          aria-label="Свернуть"
          className="h-3 w-3 rounded-full bg-[#ff5f57] hover:opacity-80"
        />
        <button
          type="button"
          aria-label="Развернуть"
          className="h-3 w-3 rounded-full bg-[#febc2e] hover:opacity-80"
        />
        <button
          type="button"
          aria-label="Закрыть"
          className="h-3 w-3 rounded-full bg-[#28c840] hover:opacity-80"
        />
      </div>
    </header>
  );
}
