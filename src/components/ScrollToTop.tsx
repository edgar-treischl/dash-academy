import { useLayoutEffect, type RefObject } from "react";
import { useLocation } from "react-router-dom";

type ScrollToTopProps = {
  contentRef: RefObject<HTMLElement | null>;
};

const ScrollToTop = ({ contentRef }: ScrollToTopProps) => {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    // The shell may own the scrolling container rather than the window.
    let element = contentRef.current;
    while (element) {
      const { overflowX, overflowY } = window.getComputedStyle(element);
      if (/(auto|scroll|overlay)/.test(`${overflowX} ${overflowY}`)) {
        element.scrollTo({ top: 0, left: 0, behavior: "instant" });
      }
      element = element.parentElement;
    }

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, [pathname, contentRef]);

  return null;
};

export default ScrollToTop;