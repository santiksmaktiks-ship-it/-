import LeftPanel from "../components/LeftPanel";
import CenterPanel from "../components/CenterPanel";
import RightPanel from "../components/RightPanel";

export default function HomePage() {
  return (
    <div className="h-full grid grid-cols-[300px_minmax(0,1fr)_300px] gap-6">
      <LeftPanel />
      <CenterPanel />
      <RightPanel />
    </div>
  );
}
