import { useRef } from "react";
import { Outlet, useMatch } from "react-router-dom";
import ScrollToTop from "../components/ScrollToTop";
import Topbar from "../components/layout/Topbar";

export default function AppLayout() {
  const contentRef = useRef<HTMLElement>(null);
  const isRetentionPage = useMatch("/retention");

  return (
    <div className="mfe-academy">
      <ScrollToTop contentRef={contentRef} />
      <div className="mfe-academy-main-content">
        <Topbar />
        <main ref={contentRef} className={isRetentionPage ? "mfe-academy-main--full-width" : undefined}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}