import { Calendar, ChevronRight, Newspaper, Pin } from "lucide-react";

type NewsItem = {
  id: string;
  date: string;
  title: string;
  excerpt: string;
  tag: "обновление" | "событие" | "анонс";
  pinned?: boolean;
};

const NEWS: NewsItem[] = [
  {
    id: "n1",
    date: "07 мая 2026",
    title: "Обновление лаунчера",
    excerpt:
      "Мы улучшили производительность загрузки модов и добавили новые функции в менеджер версий.",
    tag: "обновление",
    pinned: true,
  },
  {
    id: "n2",
    date: "29 апреля 2026",
    title: "Майский ивент: \"Песчаная буря\"",
    excerpt:
      "Запускаем сезонный ивент с эксклюзивными скинами и наградами за прохождение испытаний.",
    tag: "событие",
  },
  {
    id: "n3",
    date: "14 апреля 2026",
    title: "Поддержка 1.21.5 и Fabric",
    excerpt:
      "Добавили поддержку последней версии и автоматическую установку Fabric loader.",
    tag: "обновление",
  },
  {
    id: "n4",
    date: "01 апреля 2026",
    title: "Открыты регистрации на турнир",
    excerpt:
      "Соревновательный режим возвращается: регистрируйся в Discord, призовой фонд 50 000 ₽.",
    tag: "анонс",
  },
  {
    id: "n5",
    date: "20 марта 2026",
    title: "Новая статистика серверов",
    excerpt:
      "Теперь в правом блоке отображается онлайн в реальном времени для каждого сервера.",
    tag: "обновление",
  },
];

const TAG_STYLE: Record<NewsItem["tag"], string> = {
  обновление: "bg-accent/90 text-white",
  событие: "bg-emerald-500/85 text-white",
  анонс: "bg-violet-500/85 text-white",
};

export default function NewsPage() {
  return (
    <div className="h-full grid grid-cols-[minmax(0,1fr)_300px] gap-6">
      <section className="h-full min-h-0 flex flex-col gap-4">
        <PageHeader />
        <div className="flex-1 min-h-0 overflow-y-auto pr-1 flex flex-col gap-4">
          {NEWS.map((item) => (
            <NewsCard key={item.id} item={item} />
          ))}
        </div>
      </section>

      <aside className="h-full flex flex-col gap-6 min-h-0">
        <div className="card p-5 flex flex-col gap-3">
          <h3 className="text-sm font-semibold text-white/90">Категории</h3>
          <CategoryRow color="bg-accent/90" label="Обновления" count={12} />
          <CategoryRow color="bg-emerald-500/85" label="События" count={4} />
          <CategoryRow color="bg-violet-500/85" label="Анонсы" count={2} />
        </div>
        <div className="card p-5 flex flex-col gap-3">
          <h3 className="text-sm font-semibold text-white/90">Подписка</h3>
          <p className="text-xs text-white/55 leading-relaxed">
            Получай уведомления о новых обновлениях прямо в лаунчере.
          </p>
          <button
            type="button"
            className="h-10 rounded-xl bg-accent hover:bg-accent-hover transition-colors text-sm font-medium shadow-play"
          >
            Включить
          </button>
        </div>
      </aside>
    </div>
  );
}

function PageHeader() {
  return (
    <header className="flex items-center gap-3">
      <div className="icon-tile h-10 w-10 bg-accent/15 border-accent/30">
        <Newspaper className="h-5 w-5 text-accent" />
      </div>
      <div>
        <h2 className="text-lg font-semibold">Новости</h2>
        <p className="text-xs text-white/55">Последние события и обновления лаунчера</p>
      </div>
    </header>
  );
}

function NewsCard({ item }: { item: NewsItem }) {
  return (
    <article className="card p-5 flex gap-4">
      <div className="flex-1 min-w-0 flex flex-col gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-medium uppercase tracking-wider ${TAG_STYLE[item.tag]}`}
          >
            {item.tag}
          </span>
          {item.pinned && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/[0.06] text-[10px] text-white/65">
              <Pin className="h-3 w-3" />
              закреплено
            </span>
          )}
          <span className="inline-flex items-center gap-1 text-[11px] text-white/45">
            <Calendar className="h-3 w-3" />
            {item.date}
          </span>
        </div>
        <h3 className="text-base font-semibold">{item.title}</h3>
        <p className="text-sm text-white/65 leading-relaxed">{item.excerpt}</p>
      </div>
      <button
        type="button"
        className="self-center icon-tile h-10 w-10 hover:bg-white/[0.06]"
        aria-label="Читать"
      >
        <ChevronRight className="h-4 w-4 text-white/55" />
      </button>
    </article>
  );
}

function CategoryRow({
  color,
  label,
  count,
}: {
  color: string;
  label: string;
  count: number;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-white/[0.03] border border-white/5 px-3 py-2.5">
      <div className="flex items-center gap-2.5">
        <span className={`h-2.5 w-2.5 rounded-full ${color}`} />
        <span className="text-sm">{label}</span>
      </div>
      <span className="text-xs text-white/55">{count}</span>
    </div>
  );
}
