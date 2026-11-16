import type { DriveStep } from "driver.js";

export const RETENTION_TOUR_ID = "retention-page";

export const retentionTourSteps: DriveStep[] = [
  {
    element: '[data-tour="retention-header"]',
    popover: {
      title: "Willkommen",
      description:
        "Diese App zeigt Klassenwiederholungen nach Schulart und Schuljahr. Wir führen Sie kurz durch die wichtigsten Bereiche.",
      side: "bottom",
      align: "start",
    },
  },
  {
    element: '[data-tour="retention-year-select"]',
    popover: {
      title: "Schuljahr wählen",
      description:
        "Wählen Sie hier das Schuljahr. Diagramm, Interpretation und Trends werden automatisch aktualisiert.",
      side: "bottom",
      align: "start",
    },
  },
  {
    element: '[data-tour="retention-chart"]',
    popover: {
      title: "Wiederholungsquoten",
      description:
        "Das Balkendiagramm zeigt den Anteil der Schülerinnen und Schüler, die eine Klasse wiederholen – je Schulart.",
      side: "right",
      align: "center",
    },
  },
  {
    element: '[data-tour="retention-legend"]',
    popover: {
      title: "Legende",
      description: "Die Farben kennzeichnen die einzelnen Schularten.",
      side: "top",
      align: "start",
    },
  },
  {
    element: '[data-tour="retention-interpretation"]',
    popover: {
      title: "Interpretation",
      description:
        "Unter „Befund“ finden Sie die Einordnung der Zahlen, unter „Hinweis“ Hintergründe und empfohlene Maßnahmen.",
      side: "left",
      align: "start",
    },
  },
  {
    element: '[data-tour="retention-trend"]',
    popover: {
      title: "Trend zum Vorjahr",
      description:
        "Veränderung der Wiederholungsquote gegenüber dem Vorjahr in Prozentpunkten. Für 2022/23 liegt kein Vorjahr vor.",
      side: "top",
      align: "start",
    },
  },
];
