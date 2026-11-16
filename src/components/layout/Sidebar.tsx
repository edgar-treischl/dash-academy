
import {
  Map,
  Settings,
  BookOpen
} from "lucide-react";

import { NavLink } from "react-router-dom";

const links = [
  { label: "Roadmap", path: "/learning-path", icon: Map },
  { label: "Einstellungen", path: "/settings", icon: Settings }
];

export default function Sidebar() {
  return (
    <aside className="mfe-academy-sidebar">
      <NavLink
        to="/"
        className="mfe-academy-sidebar-brand"
      >
        <span className="mfe-academy-sidebar-brand-mark">
          <BookOpen size={20} />
        </span>
        {" "}Dash Academy
      </NavLink>

      <nav className="mfe-academy-sidebar-nav">
        {links.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={label}
            to={path}
            end={path === "/"}
            className={({ isActive }) =>
              `mfe-academy-sidebar-link${isActive ? " mfe-academy-sidebar-link--active" : ""}`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="mfe-academy-sidebar-footer">
      </div>
    </aside>
  );
}
