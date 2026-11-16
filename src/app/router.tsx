
import type { RouteObject } from "react-router-dom";

import AppLayout from "../layouts/AppLayout";
import LandingPage from "../pages/LandingPage";
import LearningPathPage from "../pages/LearningPathPage";
import ModulePage from "../pages/ModulePage";
import LessonPage from "../pages/LessonPage";
import SettingsPage from "../pages/SettingsPage";
import RetentionPage from "../pages/RetentionPage";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <LandingPage />
      },
      {
        path: "learning-path",
        element: <LearningPathPage />
      },
      {
        path: "modules/:moduleId",
        element: <ModulePage />
      },
      {
        path: "lessons/:lessonId",
        element: <LessonPage />
      },
      {
        path: "settings",
        element: <SettingsPage />
      },
      {
        path: "retention",
        element: <RetentionPage />
      }
    ]
  }
];
