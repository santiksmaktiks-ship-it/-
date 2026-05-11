import { ChevronRight, Folder, Play, Rocket } from "lucide-react";
import GrassBlock from "./GrassBlock";

export default function CenterPanel() {
  return (
    <section className="h-full flex flex-col gap-6 min-h-0">
      <NewsHero />
      <QuickLaunch />
    </section>
  );
}

function NewsHero() {
  return (
    <article className="card relative overflow-hidden h-[260px] flex-shrink-0">
      <div className="absolute inset-0 bg-news-hero" />
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at 75% 50%, rgba(255,255,255,0.06) 0%, transparent 60%), repeating-linear-gradient(45deg, rgba(255,255,255,0.02) 0 2px, transparent 2px 14px)",
        }}
      />
      <div className="relative h-full p-7 flex flex-col justify-between">
        <div>
          <span className="inline-flex items-center px-3 py-1 rounded-md bg-accent/90 text-xs font-medium uppercase tracking-wider">
            новость
          </span>
          <h2 className="mt-4 text-3xl font-bold leading-tight">
            Обновление лаунчера
          </h2>
          <p className="mt-2 text-sm text-white/75 max-w-md leading-relaxed">
            Мы улучшили производительность<br />и добавили новые функции!
          </p>
        </div>

        <div className="flex items-center justify-between">
          <button
            type="button"
            className="px-5 py-2.5 rounded-xl bg-accent hover:bg-accent-hover transition-colors text-sm font-medium shadow-[0_6px_18px_rgba(59,130,246,0.45)]"
          >
            Подробнее
          </button>

          <div className="flex items-center gap-2">
            <span className="h-1.5 w-6 rounded-full bg-white/80" />
            <span className="h-1.5 w-1.5 rounded-full bg-white/30" />
            <span className="h-1.5 w-1.5 rounded-full bg-white/30" />
          </div>

          <div className="w-[88px]" />
        </div>
      </div>
    </article>
  );
}

function QuickLaunch() {
  return (
    <article className="card p-5 flex-1 min-h-0 flex flex-col gap-4">
      <header className="flex items-center gap-3">
        <div className="icon-tile h-10 w-10 bg-accent/15 border-accent/30">
          <Rocket className="h-5 w-5 text-accent" />
        </div>
        <h3 className="text-base font-semibold">Быстрый запуск</h3>
      </header>

      <button type="button" className="row-btn !py-3.5">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 flex items-center justify-center">
            <GrassBlock size={32} />
          </div>
          <div className="text-left">
            <div className="text-sm font-medium">Последняя версия</div>
            <div className="text-xs text-white/55">1.20.4</div>
          </div>
        </div>
        <ChevronRight className="h-4 w-4 text-white/40" />
      </button>

      <div className="mt-auto grid grid-cols-[1.55fr_1fr] gap-3">
        <button
          type="button"
          onClick={() => window.launcher?.play?.()}
          className="flex items-center justify-center gap-2 h-12 rounded-xl bg-accent hover:bg-accent-hover transition-colors text-white font-semibold shadow-play"
        >
          <Play className="h-5 w-5 fill-white" />
          <span>Запустить игру</span>
        </button>
        <button
          type="button"
          onClick={() => window.launcher?.openFolder?.()}
          className="flex items-center justify-center gap-2 h-12 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] transition-colors border border-white/5 text-sm"
        >
          <Folder className="h-4 w-4 text-white/70" />
          <span>Папка с игрой</span>
        </button>
      </div>
    </article>
  );
}
