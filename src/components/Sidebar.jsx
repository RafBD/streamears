import { NavLink } from "react-router";

const linkClass = ({ isActive }) =>
  `rounded-lg px-3 py-2 hover:bg-violet-600/20 hover:text-violet-300 ${
    isActive ? "bg-violet-600/20 text-violet-300" : "text-zinc-300"
  }`;

export default function Sidebar() {
  return (
    <aside className="w-56 border-r border-zinc-800 p-4">
      <div className="mb-6 text-lg font-bold text-center">StreamEars</div>
      <nav className="flex flex-col gap-2">
        <NavLink className={linkClass} to="/" end>
          Dashboard
        </NavLink>
        <NavLink className={linkClass} to="/overlay">
          Overlay
        </NavLink>
        <NavLink className={linkClass} to="/ajustes">
          Ajustes
        </NavLink>
      </nav>
    </aside>
  );
}
