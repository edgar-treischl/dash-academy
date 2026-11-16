
import { Link, useParams, useNavigate } from "react-router-dom";
import { modules } from "../data/learning";
import { useProgressStore } from "../stores/progressStore";
import { getLesson } from "../utils/lessonLoader";
import { useState, useEffect } from "react";
import type { Lesson } from "../types/learning";
import LessonRenderer from "../components/LessonRenderer";

export default function LessonPage() {
  const { lessonId } = useParams<{ lessonId?: string }>();
  const navigate = useNavigate();
  const module = modules.find((item) => item.lessonIds.includes(lessonId ?? ""));
  const [result, setResult] = useState<{
    lessonId: string;
    lesson: Lesson | null;
  } | null>(null);

  const completeLesson = useProgressStore(
    (state) => state.completeLesson
  );

  const setCurrentLesson = useProgressStore(
    (state) => state.setCurrentLesson
  );

  // Load lesson from markdown files
  useEffect(() => {
    if (!lessonId || !module) return;
    let active = true;

    const loadLesson = async () => {
      const lesson = await getLesson(module.id, lessonId);
      if (active) {
        setResult({ lessonId, lesson });
      }
    };

    void loadLesson();
    return () => {
      active = false;
    };
  }, [lessonId, module]);

  if (!lessonId || !module) return <p>Lesson not found.</p>;
  if (result?.lessonId !== lessonId) return <p>Loading lesson...</p>;
  const lesson = result.lesson;
  if (!lesson) return <p role="alert">Failed to load lesson content.</p>;

  // Find next lesson in the module
  const currentIndex = module.lessonIds.indexOf(lesson.id);
  const nextLessonId = module.lessonIds[currentIndex + 1] || null;

  const handleComplete = () => {
    completeLesson(lesson.id);

    if (nextLessonId) {
      setCurrentLesson(nextLessonId);
      navigate(`/lessons/${nextLessonId}`);
    } else {
      navigate(`/modules/${module.id}`);
    }
  };

  return (
    <div className="learning-page learning-page--lesson">

      <header>
        <Link
          to={`/modules/${module.id}`}
          className="learning-link"
        >
          ← {module.title}
        </Link>

        <p className="learning-lesson-number">
          LESSON {lesson.order}
        </p>

        <h1 className="learning-title">
          {lesson.title}
        </h1>

        <p className="learning-description">
          {lesson.description}
        </p>

        <p className="learning-card-meta">
          {lesson.durationMinutes} minutes
        </p>
      </header>

      <LessonRenderer blocks={lesson.content} />

      <div className="learning-lesson-footer">
        <button
          onClick={handleComplete}
          className="learning-button"
        >
          Complete lesson →
        </button>
      </div>

    </div>
  );
}
