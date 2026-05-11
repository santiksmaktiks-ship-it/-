import { Box, ChevronRight, Play, Package } from "lucide-react";
import GrassBlock from "./GrassBlock";

export default function LeftPanel() {
  return (
    <aside className="card h-full p-5 flex flex-col gap-4">
      <div className="flex justify-center pt-2 pb-1">
        <GrassBlock size={108} />
      </div>

      <button type="button" className="row-btn">
        <div className="flex items-center gap-3">
          <div className="icon-tile h-9 w-9">
            <div className="h-7 w-7 rounded-md bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
              <span className="text-xs italic font-bold">N</span>
            </div>
          </div>
          <div className="text-left">
            <div className="text-sm font-medium">Игрок</div>
            <div className="text-xs text-white/60 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 inline-block" />
              Онлайн
            </div>
          </div>
        </div>
        <ChevronRight className="h-4 w-4 text-white/40" />
      </button>

      <button type="button" className="row-btn">
        <div className="flex items-center gap-3">
          <div className="icon-tile h-9 w-9">
            <Box className="h-4 w-4 text-white/80" />
          </div>
          <span className="text-sm">Установки</span>
        </div>
        <ChevronRight className="h-4 w-4 text-white/40" />
      </button>

      <button type="button" className="row-btn">
        <div className="flex items-center gap-3">
          <div className="icon-tile h-9 w-9 bg-amber-900/30 border-amber-700/30">
            <Package className="h-4 w-4 text-amber-400" />
          </div>
          <span className="text-sm">Моды</span>
        </div>
        <ChevronRight className="h-4 w-4 text-white/40" />
      </button>

      <button
        type="button"
        onClick={() => window.launcher?.play?.()}
        className="mt-auto flex items-center justify-center gap-2 h-12 rounded-xl bg-accent hover:bg-accent-hover transition-colors text-white font-semibold shadow-play"
      >
        <Play className="h-5 w-5 fill-white" />
        <span>Играть</span>
      </button>

      <div className="grid grid-cols-3 gap-3">
        <SocialButton
          label="Discord"
          bg="bg-[#5865F2]/15"
          textColor="text-[#5865F2]"
          icon={
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
              <path d="M20.317 4.369A19.79 19.79 0 0 0 16.558 3.2a.074.074 0 0 0-.078.037c-.34.6-.717 1.386-.98 2.005a18.27 18.27 0 0 0-5.487 0 12.683 12.683 0 0 0-.997-2.005.077.077 0 0 0-.078-.037A19.736 19.736 0 0 0 5.18 4.369a.07.07 0 0 0-.032.027C2.522 8.246 1.81 12.02 2.165 15.748a.082.082 0 0 0 .031.056 19.91 19.91 0 0 0 5.991 3.029.078.078 0 0 0 .084-.028 14.2 14.2 0 0 0 1.226-1.994.075.075 0 0 0-.041-.104 13.106 13.106 0 0 1-1.872-.892.075.075 0 0 1-.008-.125c.126-.094.252-.192.372-.291a.075.075 0 0 1 .077-.01c3.927 1.793 8.18 1.793 12.062 0a.075.075 0 0 1 .078.009c.12.099.246.197.373.292a.075.075 0 0 1-.006.125c-.598.349-1.22.645-1.873.891a.075.075 0 0 0-.04.105c.36.698.772 1.362 1.225 1.993a.077.077 0 0 0 .084.029 19.85 19.85 0 0 0 6.001-3.03.075.075 0 0 0 .031-.055c.5-4.244-.838-7.989-3.548-11.352a.06.06 0 0 0-.031-.028zM8.02 13.331c-1.183 0-2.157-1.085-2.157-2.42 0-1.333.955-2.418 2.157-2.418 1.21 0 2.176 1.094 2.157 2.418 0 1.335-.956 2.42-2.157 2.42zm7.974 0c-1.183 0-2.157-1.085-2.157-2.42 0-1.333.955-2.418 2.157-2.418 1.21 0 2.176 1.094 2.157 2.418 0 1.335-.946 2.42-2.157 2.42z" />
            </svg>
          }
        />
        <SocialButton
          label="VK"
          bg="bg-[#0077FF]/15"
          textColor="text-[#3B9CFF]"
          icon={
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
              <path d="M12.785 16.241s.288-.032.435-.193c.135-.148.131-.425.131-.425s-.018-1.302.583-1.494c.593-.19 1.355 1.273 2.163 1.835.609.425 1.071.331 1.071.331l2.155-.031s1.126-.071.591-.961c-.043-.073-.31-.659-1.602-1.864-1.353-1.262-1.172-1.058.457-3.232.992-1.323 1.388-2.131 1.265-2.477-.117-.331-.847-.244-.847-.244l-2.427.015s-.18-.025-.314.056c-.13.079-.215.265-.215.265s-.385 1.025-.897 1.897c-1.082 1.839-1.515 1.936-1.692 1.821-.412-.266-.309-1.07-.309-1.641 0-1.785.27-2.531-.526-2.724-.264-.063-.458-.105-1.133-.112-.866-.009-1.6.003-2.014.206-.276.135-.489.436-.359.453.16.022.522.099.714.36.249.336.24 1.092.24 1.092s.143 2.099-.334 2.36c-.327.179-.776-.187-1.74-1.852-.494-.853-.867-1.795-.867-1.795s-.072-.176-.2-.27c-.156-.115-.374-.151-.374-.151l-2.307.015s-.346.01-.473.16c-.113.135-.009.413-.009.413s1.806 4.226 3.852 6.355c1.877 1.954 4.008 1.826 4.008 1.826h.965z" />
            </svg>
          }
        />
        <SocialButton
          label="YouTube"
          bg="bg-[#FF0000]/15"
          textColor="text-[#FF4D4D]"
          icon={
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.546 15.568V8.432L15.818 12l-6.272 3.568z" />
            </svg>
          }
        />
      </div>
    </aside>
  );
}

type SocialButtonProps = {
  label: string;
  icon: React.ReactNode;
  bg: string;
  textColor: string;
};

function SocialButton({ label, icon, bg, textColor }: SocialButtonProps) {
  return (
    <button
      type="button"
      className="flex flex-col items-center justify-center gap-1.5 h-14 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] transition-colors border border-white/5"
    >
      <span className={`h-7 w-7 rounded-md ${bg} ${textColor} flex items-center justify-center`}>
        {icon}
      </span>
      <span className="text-[11px] text-white/70">{label}</span>
    </button>
  );
}
