
import { Bell, Search, BookOpen } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function Topbar() {
  return (
    <header className="mfe-academy-topbar">
      <div className="mfe-academy-topbar-left">
        <NavLink
          to="/"
          className="mfe-academy-topbar-brand"
        >
          <span className="mfe-academy-topbar-brand-mark">
            <BookOpen size={20} />
          </span>
          {" "}Dash Academy
        </NavLink>
      </div>

      <div className="mfe-academy-topbar-right">
        <div className="mfe-academy-search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Suche ..."
          />
        </div>

        <button
          className="mfe-academy-notification-button"
          aria-label="Notifications"
        >
          <Bell size={20} />
          <span className="mfe-academy-notification-dot" />
        </button>
      </div>
    </header>
  );
}
