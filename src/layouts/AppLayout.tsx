import { Outlet } from "react-router-dom";
import Topbar from "../components/layout/Topbar";

export default function AppLayout() {
  return (
    <div className="app-layout">
      <div className="main-content">
        <Topbar />
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}