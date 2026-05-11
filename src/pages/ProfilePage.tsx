import { useState } from "react";
import {
  Calendar,
  ChevronRight,
  Clock,
  LogOut,
  Mail,
  Pencil,
  Shield,
  Trophy,
  User,
} from "lucide-react";

export default function ProfilePage() {
  const [nickname, setNickname] = useState("Игрок");
  const [editing, setEditing] = useState(false);

  return (
    <div className="h-full grid grid-cols-[minmax(0,1fr)_300px] gap-6 min-h-0">
      <section className="h-full min-h-0 flex flex-col gap-4">
        <PageHeader />

        <article className="card p-6 flex items-center gap-5">
          <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-[0_8px_24px_rgba(59,130,246,0.5)]">
            <span className="text-3xl italic font-bold">N</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              {editing ? (
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  onBlur={() => setEditing(false)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") setEditing(false);
                  }}
                  className="text-xl font-bold bg-white/[0.06] border border-white/10 rounded-lg px-2 py-1 outline-none focus:ring-1 focus:ring-accent"
                  autoFocus
                />
              ) : (
                <h2 className="text-xl font-bold">{nickname}</h2>
              )}
              <button
                type="button"
                onClick={() => setEditing((v) => !v)}
                aria-label="Изменить никнейм"
                className="icon-tile h-7 w-7 hover:bg-white/[0.06]"
              >
                <Pencil className="h-3.5 w-3.5 text-white/55" />
              </button>
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-white/55">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Онлайн
            </div>
            <div className="mt-1 text-xs text-white/45">UUID: 8f3d…b21c</div>
          </div>
          <button
            type="button"
            className="flex items-center gap-2 h-10 px-4 rounded-xl bg-white/[0.05] hover:bg-red-500/10 hover:text-red-300 transition-colors text-sm border border-white/5"
          >
            <LogOut className="h-4 w-4" />
            Выйти
          </button>
        </article>

        <div className="grid grid-cols-3 gap-4">
          <StatCard label="Часов в игре" value="248" icon={Clock} />
          <StatCard label="Достижений" value="42" icon={Trophy} />
          <StatCard label="С нами с" value="мар 2024" icon={Calendar} />
        </div>

        <article className="card p-5 flex flex-col gap-3 flex-1 min-h-0">
          <h3 className="text-sm font-semibold">Последние сессии</h3>
          <div className="flex flex-col gap-2 overflow-y-auto pr-1">
            <SessionRow version="1.20.4" date="Сегодня, 14:32" duration="2 ч 14 мин" />
            <SessionRow version="1.21.4" date="Вчера, 22:05" duration="1 ч 02 мин" />
            <SessionRow version="1.20.4" date="06 мая, 18:20" duration="3 ч 41 мин" />
            <SessionRow version="1.19.4" date="05 мая, 11:10" duration="48 мин" />
          </div>
        </article>
      </section>

      <aside className="h-full flex flex-col gap-6 min-h-0">
        <div className="card p-5 flex flex-col gap-3">
          <h3 className="text-sm font-semibold text-white/90">Аккаунт</h3>
          <AccountRow Icon={Mail} label="Email" value="elvin@example.com" />
          <AccountRow Icon={Shield} label="2FA" value="Включена" />
          <AccountRow Icon={User} label="Тип" value="Premium" />
        </div>
        <div className="card p-3 flex flex-col gap-1">
          <SidebarLink label="Сменить пароль" />
          <SidebarLink label="Привязка скина" />
          <SidebarLink label="История платежей" />
        </div>
      </aside>
    </div>
  );
}

function PageHeader() {
  return (
    <header className="flex items-center gap-3">
      <div className="icon-tile h-10 w-10 bg-accent/15 border-accent/30">
        <User className="h-5 w-5 text-accent" />
      </div>
      <div>
        <h2 className="text-lg font-semibold">Профиль</h2>
        <p className="text-xs text-white/55">Информация об аккаунте и игровой статистике</p>
      </div>
    </header>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}) {
  return (
    <div className="card p-4 flex items-center gap-3">
      <div className="icon-tile h-10 w-10 bg-accent/15 border-accent/30">
        <Icon className="h-4 w-4 text-accent" />
      </div>
      <div>
        <div className="text-lg font-bold leading-none">{value}</div>
        <div className="text-[11px] text-white/55 mt-1">{label}</div>
      </div>
    </div>
  );
}

function SessionRow({
  version,
  date,
  duration,
}: {
  version: string;
  date: string;
  duration: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-white/[0.03] border border-white/5 px-3 py-2.5">
      <div className="flex items-center gap-3">
        <span className="text-xs px-2 py-0.5 rounded-md bg-accent/20 text-accent">
          {version}
        </span>
        <span className="text-sm text-white/80">{date}</span>
      </div>
      <span className="text-xs text-white/55">{duration}</span>
    </div>
  );
}

function AccountRow({
  Icon,
  label,
  value,
}: {
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <div className="icon-tile h-8 w-8 bg-white/[0.04]">
          <Icon className="h-4 w-4 text-white/70" />
        </div>
        <span className="text-sm text-white/85">{label}</span>
      </div>
      <span className="text-xs text-white/55">{value}</span>
    </div>
  );
}

function SidebarLink({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="flex items-center justify-between rounded-xl px-3 py-2.5 hover:bg-white/[0.04] transition-colors text-left"
    >
      <span className="text-sm">{label}</span>
      <ChevronRight className="h-4 w-4 text-white/40" />
    </button>
  );
}
