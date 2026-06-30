import { SIBLING_GAME } from "../config";

const Header = ({ onTitleTap }: { onTitleTap?: () => void }) => (
  <header className="flex items-center justify-between pt-6">
    <h1
      className="cursor-default select-none text-xl font-bold tracking-tight"
      onClick={onTitleTap}
    >
      Sports
    </h1>
    <a
      href={SIBLING_GAME.url}
      className="link link-hover text-sm opacity-70"
      title={`Play the ${SIBLING_GAME.name}`}
    >
      States ↗
    </a>
  </header>
);

export default Header;
