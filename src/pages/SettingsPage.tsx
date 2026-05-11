import { useState } from "react";
import {
  Cpu,
  Globe,
  HardDrive,
  Monitor,
  Settings as SettingsIcon,
  Sliders,
  Sparkles,
  Terminal,
} from "lucide-react";
import type { ComponentType, SVGProps } from "react";

export default function SettingsPage() {
  const [ram, setRam] = useState(4);
  const [closeOnLaunch, setCloseOnLaunch] = useState(true);
  const [enableSnapshots, setEnableSnapshots] = useState(false);
  const [hwAccel, setHwAccel] = useState(true);
  const [resolution, setResolution] = useState("1920×1080");
  const [language, setLanguage] = useState("Русский");

  return (
    <div className="h-full grid grid-cols-[minmax(0,1fr)_300px] gap-6 min-h-0">
      <section className="h-full min-h-0 flex flex-col gap-4">
        <PageHeader />
        <div className="flex-1 min-h-0 overflow-y-auto pr-1 flex flex-col gap-4">
          <SettingCard title="Игра" Icon={Sparkles}>
            <SliderRow
              label="Выделенная память"
              value={`${ram} ГБ`}
              min={2}
              max={16}
              step={1}
              current={ram}
              onChange={setRam}
            />
            <ToggleRow
              label="Закрывать лаунчер при запуске"
              checked={closeOnLaunch}
              onChange={setCloseOnLaunch}
            />
            <ToggleRow
              label="Показывать snapshot-версии"
              checked={enableSnapshots}
              onChange={setEnableSnapshots}
            />
          </SettingCard>

          <SettingCard title="Графика" Icon={Monitor}>
            <SelectRow
              label="Разрешение окна"
              value={resolution}
              options={["1280×720", "1600×900", "1920×1080", "2560×1440"]}
              onChange={setResolution}
            />
            <ToggleRow
              label="Аппаратное ускорение"
              checked={hwAccel}
              onChange={setHwAccel}
            />
          </SettingCard>

          <SettingCard title="Java" Icon={Terminal}>
            <InputRow
              label="Путь к Java"
              value="/usr/lib/jvm/java-21/bin/java"
              placeholder="Авто"
            />
            <InputRow
              label="Доп. JVM-аргументы"
              value="-XX:+UnlockExperimentalVMOptions -XX:+UseG1GC"
              placeholder="—"
            />
          </SettingCard>

          <SettingCard title="Язык и регион" Icon={Globe}>
            <SelectRow
              label="Язык интерфейса"
              value={language}
              options={["Русский", "English", "Українська", "Polski"]}
              onChange={setLanguage}
            />
          </SettingCard>
        </div>
      </section>

      <aside className="h-full flex flex-col gap-6 min-h-0">
        <div className="card p-5 flex flex-col gap-4">
          <h3 className="text-sm font-semibold text-white/90">Системное</h3>
          <SystemRow Icon={Cpu} label="ЦП" value="Intel i7-12700K" />
          <SystemRow Icon={HardDrive} label="ОЗУ" value="32 ГБ" />
          <SystemRow Icon={Monitor} label="GPU" value="RTX 4070" />
        </div>
        <div className="card p-5 flex flex-col gap-3">
          <h3 className="text-sm font-semibold text-white/90">Действия</h3>
          <button
            type="button"
            className="h-10 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] transition-colors border border-white/5 text-sm"
          >
            Очистить кэш
          </button>
          <button
            type="button"
            className="h-10 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] transition-colors border border-white/5 text-sm"
          >
            Сбросить настройки
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
        <SettingsIcon className="h-5 w-5 text-accent" />
      </div>
      <div>
        <h2 className="text-lg font-semibold">Настройки</h2>
        <p className="text-xs text-white/55">Параметры лаунчера и игры</p>
      </div>
    </header>
  );
}

function SettingCard({
  title,
  Icon,
  children,
}: {
  title: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  children: React.ReactNode;
}) {
  return (
    <article className="card p-5 flex flex-col gap-4">
      <header className="flex items-center gap-3">
        <div className="icon-tile h-9 w-9 bg-white/[0.04]">
          <Icon className="h-4 w-4 text-white/80" />
        </div>
        <h3 className="text-sm font-semibold">{title}</h3>
      </header>
      <div className="flex flex-col gap-3">{children}</div>
    </article>
  );
}

function SliderRow({
  label,
  value,
  min,
  max,
  step,
  current,
  onChange,
}: {
  label: string;
  value: string;
  min: number;
  max: number;
  step: number;
  current: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex flex-col gap-2 rounded-xl bg-white/[0.03] border border-white/5 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm">
          <Sliders className="h-4 w-4 text-white/55" />
          <span>{label}</span>
        </div>
        <span className="text-sm text-accent font-medium">{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={current}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-blue-500"
      />
    </div>
  );
}

function ToggleRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex items-center justify-between rounded-xl bg-white/[0.03] border border-white/5 px-4 py-3 hover:bg-white/[0.05] transition-colors text-left"
      aria-pressed={checked}
    >
      <span className="text-sm">{label}</span>
      <span
        className={`relative h-6 w-11 rounded-full transition-colors ${
          checked ? "bg-accent" : "bg-white/[0.12]"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
            checked ? "translate-x-5" : ""
          }`}
        />
      </span>
    </button>
  );
}

function SelectRow({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-white/[0.03] border border-white/5 px-4 py-2.5">
      <span className="text-sm">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-white/[0.06] border border-white/5 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-accent"
      >
        {options.map((o) => (
          <option key={o} value={o} className="bg-bg-card">
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

function InputRow({
  label,
  value,
  placeholder,
}: {
  label: string;
  value: string;
  placeholder: string;
}) {
  return (
    <label className="flex flex-col gap-1.5 rounded-xl bg-white/[0.03] border border-white/5 px-4 py-3">
      <span className="text-xs text-white/55">{label}</span>
      <input
        type="text"
        defaultValue={value}
        placeholder={placeholder}
        className="bg-transparent text-sm outline-none placeholder:text-white/30"
      />
    </label>
  );
}

function SystemRow({
  Icon,
  label,
  value,
}: {
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
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
