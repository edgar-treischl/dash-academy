import { useState } from "react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { routes } from "./app/router";
import "./styles/globals.css";

export default function AcademyApp() {
  const [router] = useState(() => createMemoryRouter(routes));

  return <RouterProvider router={router} />;
}
