
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
    <aside className="sidebar">
      <NavLink
        to="/"
        className="sidebar-brand"
      >
        <span className="sidebar-brand-mark">
          <BookOpen size={20} />
        </span>
        {" "}Dash Academy
      </NavLink>

      <nav className="sidebar-nav">
        {links.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={label}
            to={path}
            end={path === "/"}
            className={({ isActive }) =>
              `sidebar-link${isActive ? " sidebar-link--active" : ""}`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
      </div>
    </aside>
  );
}
