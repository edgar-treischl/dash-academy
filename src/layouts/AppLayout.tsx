import { Outlet } from "react-router-dom";
import Topbar from "../components/layout/Topbar";

export default function AppLayout() {
  return (
    <div className="mfe-academy">
      <div className="mfe-academy-main-content">
        <Topbar />
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}