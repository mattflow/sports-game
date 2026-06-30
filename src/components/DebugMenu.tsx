type DebugMenuProps = {
  onWin: () => void;
  onAllButOne: () => void;
  allButOneTeam: string | null;
  onAddTen: () => void;
  onClear: () => void;
  onClose: () => void;
};

// Hidden test panel. Toggle with Ctrl/Cmd+Shift+D, or load the page with ?debug.
const DebugMenu = ({
  onWin,
  onAllButOne,
  allButOneTeam,
  onAddTen,
  onClear,
  onClose,
}: DebugMenuProps) => (
  <div className="fixed bottom-4 right-4 z-50 w-64 rounded-lg border border-base-300 bg-base-100 p-3 shadow-xl">
    <div className="mb-2 flex items-center justify-between">
      <span className="text-sm font-bold">Debug</span>
      <button className="btn-ghost btn-xs btn" onClick={onClose}>
        ✕
      </button>
    </div>
    <div className="flex flex-col gap-1.5">
      <button className="btn-xs btn" onClick={onWin}>
        Win — name all
      </button>
      <button className="btn-xs btn" onClick={onAllButOne} disabled={!allButOneTeam}>
        {allButOneTeam ? `All but 1 — then name ${allButOneTeam}` : "All but 1"}
      </button>
      <button className="btn-xs btn" onClick={onAddTen}>
        Add 10 random
      </button>
      <button className="btn-ghost btn-xs btn" onClick={onClear}>
        Clear
      </button>
    </div>
  </div>
);

export default DebugMenu;
