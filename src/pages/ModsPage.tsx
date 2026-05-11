import { useMemo, useState } from "react";
import { Download, Package, Search, Trash2 } from "lucide-react";

type Mod = {
  id: string;
  name: string;
  author: string;
  description: string;
  version: string;
  category: "Оптимизация" | "Графика" | "Геймплей" | "Утилиты";
  installed: boolean;
  enabled: boolean;
};

const INITIAL_MODS: Mod[] = [
  {
    id: "sodium",
    name: "Sodium",
    author: "JellySquid",
    description: "Современный движок рендера, дающий +200% к FPS.",
    version: "0.6.0",
    category: "Оптимизация",
    installed: true,
    enabled: true,
  },
  {
    id: "iris",
    name: "Iris Shaders",
    author: "IrisShaders",
    description: "Поддержка шейдеров OptiFine на современной базе Sodium.",
    version: "1.7.5",
    category: "Графика",
    installed: true,
    enabled: true,
  },
  {
    id: "fabric-api",
    name: "Fabric API",
    author: "FabricMC",
    description: "Базовый API для большинства модов на Fabric.",
    version: "0.110.5",
    category: "Утилиты",
    installed: true,
    enabled: true,
  },
  {
    id: "jei",
    name: "Just Enough Items",
    author: "mezz",
    description: "Просмотр рецептов и поиск предметов прямо в инвентаре.",
    version: "19.21.0",
    category: "Утилиты",
    installed: true,
    enabled: false,
  },
  {
    id: "create",
    name: "Create",
    author: "simibubi",
    description: "Механизмы и автоматизация в стиле стимпанк.",
    version: "6.0.0",
    category: "Геймплей",
    installed: false,
    enabled: false,
  },
  {
    id: "complementary",
    name: "Complementary Shaders",
    author: "EminGT",
    description: "Реалистичные шейдеры с мягкими тенями и водой.",
    version: "5.3",
    category: "Графика",
    installed: false,
    enabled: false,
  },
];

const CATEGORIES = ["Все", "Оптимизация", "Графика", "Геймплей", "Утилиты"] as const;
type Category = (typeof CATEGORIES)[number];

export default function ModsPage() {
  const [mods, setMods] = useState<Mod[]>(INITIAL_MODS);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category>("Все");

  const filtered = useMemo(() => {
    return mods.filter((m) => {
      const matchQuery =
        query.length === 0 ||
        m.name.toLowerCase().includes(query.toLowerCase()) ||
        m.description.toLowerCase().includes(query.toLowerCase());
      const matchCat = category === "Все" || m.category === category;
      return matchQuery && matchCat;
    });
  }, [mods, query, category]);

  const installed = mods.filter((m) => m.installed).length;
  const enabled = mods.filter((m) => m.enabled).length;

  return (
    <div className="h-full grid grid-cols-[minmax(0,1fr)_300px] gap-6 min-h-0">
      <section className="h-full min-h-0 flex flex-col gap-4">
        <PageHeader />

        <div className="card p-3 flex items-center gap-2">
          <div className="flex-1 flex items-center gap-2 bg-white/[0.03] border border-white/5 rounded-xl px-3 py-2">
            <Search className="h-4 w-4 text-white/45" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Поиск модов..."
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-white/35"
            />
          </div>
          <div className="flex items-center gap-1 bg-white/[0.03] border border-white/5 rounded-xl p-1">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${
                  category === c
                    ? "bg-accent text-white"
                    : "text-white/65 hover:text-white hover:bg-white/[0.04]"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto pr-1 flex flex-col gap-3">
          {filtered.length === 0 ? (
            <div className="card p-8 text-center text-sm text-white/45">
              Ничего не найдено
            </div>
          ) : (
            filtered.map((mod) => (
              <ModRow
                key={mod.id}
                mod={mod}
                onToggle={() =>
                  setMods((prev) =>
                    prev.map((m) =>
                      m.id === mod.id ? { ...m, enabled: !m.enabled } : m,
                    ),
                  )
                }
                onInstall={() =>
                  setMods((prev) =>
                    prev.map((m) =>
                      m.id === mod.id
                        ? { ...m, installed: true, enabled: true }
                        : m,
                    ),
                  )
                }
                onRemove={() =>
                  setMods((prev) =>
                    prev.map((m) =>
                      m.id === mod.id
                        ? { ...m, installed: false, enabled: false }
                        : m,
                    ),
                  )
                }
              />
            ))
          )}
        </div>
      </section>

      <aside className="h-full flex flex-col gap-6 min-h-0">
        <div className="card p-5 flex flex-col gap-4">
          <h3 className="text-sm font-semibold text-white/90">Статистика</h3>
          <StatRow label="Установлено" value={`${installed}`} />
          <StatRow label="Включено" value={`${enabled}`} />
          <StatRow label="Доступно" value={`${mods.length - installed}`} />
        </div>
        <div className="card p-5 flex flex-col gap-3">
          <h3 className="text-sm font-semibold text-white/90">Сборки</h3>
          <p className="text-xs text-white/55">
            Создавай готовые наборы модов и переключайся между ними одним кликом.
          </p>
          <button
            type="button"
            className="h-10 rounded-xl bg-accent hover:bg-accent-hover transition-colors text-sm font-medium shadow-play"
          >
            Создать сборку
          </button>
        </div>
      </aside>
    </div>
  );
}

function PageHeader() {
  return (
    <header className="flex items-center gap-3">
      <div className="icon-tile h-10 w-10 bg-amber-900/30 border-amber-700/30">
        <Package className="h-5 w-5 text-amber-400" />
      </div>
      <div>
        <h2 className="text-lg font-semibold">Моды</h2>
        <p className="text-xs text-white/55">Управление модификациями для текущей версии</p>
      </div>
    </header>
  );
}

function ModRow({
  mod,
  onToggle,
  onInstall,
  onRemove,
}: {
  mod: Mod;
  onToggle: () => void;
  onInstall: () => void;
  onRemove: () => void;
}) {
  return (
    <article className="card p-4 flex items-center gap-4">
      <div className="icon-tile h-12 w-12 bg-amber-900/20 border-amber-700/30 shrink-0">
        <Package className="h-5 w-5 text-amber-400" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="text-sm font-semibold">{mod.name}</h3>
          <span className="text-[11px] text-white/45">v{mod.version}</span>
          <span className="text-[11px] px-2 py-0.5 rounded-md bg-white/[0.05] text-white/55">
            {mod.category}
          </span>
        </div>
        <p className="text-xs text-white/60 mt-0.5">
          {mod.description} <span className="text-white/35">· {mod.author}</span>
        </p>
      </div>

      {mod.installed ? (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggle}
            aria-pressed={mod.enabled}
            className={`h-9 px-3 rounded-lg text-xs transition-colors ${
              mod.enabled
                ? "bg-accent/20 text-accent border border-accent/40"
                : "bg-white/[0.05] text-white/70 border border-white/5"
            }`}
          >
            {mod.enabled ? "Включён" : "Выключен"}
          </button>
          <button
            type="button"
            onClick={onRemove}
            aria-label="Удалить мод"
            className="icon-tile h-9 w-9 hover:bg-red-500/10 hover:border-red-500/30"
          >
            <Trash2 className="h-4 w-4 text-white/55" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={onInstall}
          className="flex items-center gap-1.5 h-9 px-3 rounded-lg bg-accent hover:bg-accent-hover transition-colors text-xs font-medium"
        >
          <Download className="h-4 w-4" />
          Установить
        </button>
      )}
    </article>
  );
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-white/[0.03] border border-white/5 px-3 py-2.5">
      <span className="text-sm text-white/80">{label}</span>
      <span className="text-sm font-semibold text-accent">{value}</span>
    </div>
  );
}
