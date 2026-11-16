import { Outlet, useMatch } from "react-router-dom";
import Topbar from "../components/layout/Topbar";

export default function AppLayout() {
  const isRetentionPage = useMatch("/retention");

  return (
    <div className="mfe-academy">
      <div className="mfe-academy-main-content">
        <Topbar />
        <main className={isRetentionPage ? "mfe-academy-main--full-width" : undefined}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}