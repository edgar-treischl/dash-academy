
export type ModuleStatus =
  | "locked"
  | "available"
  | "in_progress"
  | "completed";

export type LessonStatus =
  | "available"
  | "in_progress"
  | "completed";

export type ContentBlock =
  | {
      id: string;
      type: "text";
      heading?: string;
      content: string;
      image?: string;
      imageAlt?: string;
    }
  | {
      id: string;
      type: "markdown";
      content: string;
      components?: Array<{
        componentName: string;
        props?: Record<string, unknown>;
      }>;
    }
  | {
      id: string;
      type: "react-component";
      componentName: string;
      props?: Record<string, unknown>;
      fallback?: string;
    }
  | {
      id: string;
      type: "callout";
      content: string;
      style?: "info" | "warning" | "success";
    }
  | {
      id: string;
      type: "quiz";
      question: string;
      answers: string[];
      correctAnswer: number;
      explanation?: string;
    };

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  description: string;
  durationMinutes: number;
  order: number;
  content: ContentBlock[];
}

export interface LearningModule {
  id: string;
  title: string;
  description: string;
  icon: string;
  order: number;
  lessonIds: string[];
  previewImage?: string;
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  moduleIds: string[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  image?: string;
  fallbackIcon?: string;
}

export interface UserProgress {
  completedLessonIds: string[];
  currentLessonId: string | null;
  earnedAchievementIds: string[];
}
