import {
  BookOpen,
  ChevronRight,
  Globe,
  HelpCircle,
  Users,
} from "lucide-react";
import type { ComponentType, SVGProps } from "react";

export default function RightPanel() {
  return (
    <aside className="h-full flex flex-col gap-6 min-h-0">
      <OnlineStatusCard />
      <UsefulSection />
    </aside>
  );
}

function OnlineStatusCard() {
  return (
    <div className="card p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white/90">Онлайн статус</h3>
        <span className="h-2 w-2 rounded-full bg-accent shadow-[0_0_10px_rgba(59,130,246,0.7)]" />
      </div>

      <div className="flex items-center gap-3">
        <div className="icon-tile h-12 w-12 bg-accent/15 border-accent/30">
          <Users className="h-5 w-5 text-accent" />
        </div>
        <div>
          <div className="text-2xl font-bold leading-none">2537</div>
          <div className="text-xs text-white/55 mt-1">игроков онлайн</div>
        </div>
      </div>

      <button type="button" className="row-btn">
        <span className="text-sm">Серверы</span>
        <ChevronRight className="h-4 w-4 text-white/40" />
      </button>
    </div>
  );
}

function UsefulSection() {
  return (
    <div className="flex flex-col gap-3 min-h-0">
      <h3 className="text-sm font-semibold text-white/80 px-1">Полезное</h3>
      <div className="card p-3 flex flex-col gap-2">
        <UsefulItem label="Инструкции" Icon={BookOpen} tone="blue" />
        <UsefulItem label="Поддержка" Icon={HelpCircle} tone="violet" />
        <UsefulItem label="Наш сайт" Icon={Globe} tone="cyan" />
      </div>
    </div>
  );
}

type Tone = "blue" | "violet" | "cyan";

const TONE_CLASSES: Record<Tone, string> = {
  blue: "bg-blue-500/15 border-blue-500/30 text-blue-400",
  violet: "bg-violet-500/15 border-violet-500/30 text-violet-400",
  cyan: "bg-cyan-500/15 border-cyan-500/30 text-cyan-400",
};

type UsefulItemProps = {
  label: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  tone: Tone;
};

function UsefulItem({ label, Icon, tone }: UsefulItemProps) {
  return (
    <button type="button" className="row-btn !py-2.5 !bg-transparent hover:!bg-white/[0.04]">
      <div className="flex items-center gap-3">
        <div className={`icon-tile h-9 w-9 ${TONE_CLASSES[tone]}`}>
          <Icon className="h-4 w-4" />
        </div>
        <span className="text-sm">{label}</span>
      </div>
      <ChevronRight className="h-4 w-4 text-white/40" />
    </button>
  );
}
