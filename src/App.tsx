import TopBar from "./components/TopBar";
import LeftPanel from "./components/LeftPanel";
import CenterPanel from "./components/CenterPanel";
import RightPanel from "./components/RightPanel";

export default function App() {
  return (
    <div className="h-screen w-screen bg-app-bg text-white overflow-hidden flex flex-col">
      <TopBar />
      <main className="flex-1 min-h-0 px-6 pb-6 pt-2">
        <div className="h-full grid grid-cols-[300px_minmax(0,1fr)_300px] gap-6">
          <LeftPanel />
          <CenterPanel />
          <RightPanel />
        </div>
      </main>
    </div>
  );
}
