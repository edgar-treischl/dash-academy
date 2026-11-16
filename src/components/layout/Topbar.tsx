
import { Bell, Search, BookOpen } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function Topbar() {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <NavLink
          to="/"
          className="topbar-brand"
        >
          <span className="topbar-brand-mark">
            <BookOpen size={20} />
          </span>
          {" "}Dash Academy
        </NavLink>
      </div>

      <div className="topbar-right">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Suche ..."
          />
        </div>

        <button
          className="notification-button"
          aria-label="Notifications"
        >
          <Bell size={20} />
          <span className="notification-dot" />
        </button>
      </div>
    </header>
  );
}
