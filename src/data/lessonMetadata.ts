import type { LearningPath, LearningModule, Achievement } from "../types/learning";
import introImage from "../assets/intro.svg";

/**
 * Lesson metadata - defines modules and lessons
 * Content is loaded from markdown files in src/lessons/
 * 
 * This separates structural metadata (which lessons exist, their order)
 * from content (what they teach), making it easy to:
 * - Add new lessons by creating markdown files
 * - Reorder lessons by editing this file
 * - Update titles/descriptions without touching content
 */

export const learningPath: LearningPath = {
  id: "data-literacy-foundations",
  title: "Data Literacy",
  description: "Alles Wichtige im Überblick.",
  moduleIds: [
    "foundations",
    "working-with-data",
    "data-analysis",
    "visualization",
    "data-in-practice"
  ]
};

export const modules: LearningModule[] = [
  {
    id: "foundations",
    title: "Data Foundations",
    description: "Vertiefen Sie Ihr Verständnis von Daten.",
    icon: "database",
    order: 1,
    lessonIds: ["lesson-1", "lesson-2", "lesson-3"],
    previewImage: introImage
  },
  {
    id: "data-analysis",
    title: "Datenanalyse",
    description: "Daten untersuchen und auswerten.",
    icon: "chart",
    order: 2,
    lessonIds: ["lesson-7", "lesson-8", "lesson-9"],
    previewImage: undefined
  },
  {
    id: "visualization",
    title: "Data Visualisierung",
    description: "Ergebnisse visuell darstellen.",
    icon: "presentation",
    order: 3,
    lessonIds: ["lesson-10", "lesson-11"],
    previewImage: undefined
  },
  {
    id: "data-in-practice",
    title: "Data in Practice",
    description: "Datenkompetenz in der Praxis anwenden.",
    icon: "briefcase",
    order: 4,
    lessonIds: ["lesson-12", "lesson-13"],
    previewImage: undefined
  }
];

export const achievements: Achievement[] = [
  {
    id: "first-lesson",
    title: "Foundation Badge",
    description: "Foundation Lektion mit Bravur bestanden.",
    image: undefined,
    fallbackIcon: "🏅"
  },
  {
    id: "module-master",
    title: "Analysis Master",
    description: "Analyse Track erfolgreich beendet.",
    image: undefined,
    fallbackIcon: "⭐"
  },
  {
    id: "data-champion",
    title: "Data Champion",
    description: "All Module erfolgreich abgeschlossen.",
    image: undefined,
    fallbackIcon: "🏆"
  }
];
