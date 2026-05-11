import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { MINECRAFT_VERSIONS } from "../data/versions";
import GrassBlock from "./GrassBlock";

type Props = {
  value: string;
  onChange: (version: string) => void;
};

export default function VersionSelector({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDocMouseDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDocMouseDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocMouseDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="row-btn !py-3.5 w-full"
      >
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 flex items-center justify-center">
            <GrassBlock size={32} />
          </div>
          <div className="text-left">
            <div className="text-sm font-medium">Версия</div>
            <div className="text-xs text-white/55">{value}</div>
          </div>
        </div>
        <ChevronDown
          className={`h-4 w-4 text-white/40 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          role="listbox"
          aria-label="Выбор версии Minecraft"
          className="absolute left-0 right-0 top-full mt-2 z-20 rounded-xl bg-bg-card border border-border-card shadow-card overflow-hidden"
        >
          <div className="max-h-72 overflow-y-auto py-1">
            {MINECRAFT_VERSIONS.map((v) => {
              const selected = v === value;
              return (
                <button
                  type="button"
                  role="option"
                  aria-selected={selected}
                  key={v}
                  onClick={() => {
                    onChange(v);
                    setOpen(false);
                  }}
                  className={`flex items-center justify-between w-full px-4 py-2.5 text-left text-sm transition-colors ${
                    selected
                      ? "bg-accent/15 text-white"
                      : "text-white/85 hover:bg-white/[0.05]"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <span className="h-5 w-5 flex items-center justify-center">
                      <GrassBlock size={18} />
                    </span>
                    <span>{v}</span>
                  </span>
                  {selected && <Check className="h-4 w-4 text-accent" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
