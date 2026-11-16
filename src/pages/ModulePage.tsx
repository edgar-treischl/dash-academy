
import { Link, useParams } from "react-router-dom";
import { modules } from "../data/learning";
import { useProgressStore } from "../stores/progressStore";
import { CheckCircle2, Circle } from "lucide-react";
import { useState, useEffect } from "react";
import { getLesson } from "../utils/lessonLoader";
import type { Lesson } from "../types/learning";

export default function ModulePage() {
  const { moduleId } = useParams();
  const [moduleLessons, setModuleLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);

  const module = modules.find(
    (item) => item.id === moduleId
  );

  const completed = useProgressStore(
    (state) => state.completedLessonIds
  );

  useEffect(() => {
    if (!module) {
      return;
    }

    const loadLessons = async () => {
      try {
        const lessons = await Promise.all(
          module.lessonIds.map((lessonId) =>
            getLesson(module.id, lessonId)
          )
        );
        setModuleLessons(
          lessons
            .filter((l): l is Lesson => l !== null)
            .sort((a, b) => a.order - b.order)
        );
      } catch (err) {
        console.error("Error loading module lessons:", err);
      } finally {
        setLoading(false);
      }
    };

    loadLessons();
  }, [module]);

  if (!module) {
    return <p>Module not found.</p>;
  }

  if (loading) {
    return <p>Loading module...</p>;
  }

  return (
    <div className="learning-page">

      <header>
        <Link
          to="/learning-path"
          className="learning-link"
        >
          ← Zurück zur Übersicht
        </Link>

        <h1 className="learning-title">
          {module.title}
        </h1>

        <p className="learning-description">
          {module.description}
        </p>
      </header>

      <section className="learning-list">
        {moduleLessons.map((lesson, index) => {
          const isCompleted = completed.includes(lesson.id);

          return (
            <Link
              key={lesson.id}
              to={`/lessons/${lesson.id}`}
              className="learning-card learning-card--link learning-lesson-row"
            >
              {isCompleted ? (
                <CheckCircle2 className="learning-status-complete" />
              ) : (
                <Circle className="learning-muted" />
              )}

              <div className="learning-row-content">
                <p className="learning-meta">
                  LESSON {index + 1}
                </p>

                <h3 className="learning-card-title">
                  {lesson.title}
                </h3>

                <p className="learning-card-description">
                  {lesson.description}
                </p>
              </div>

              <span className="learning-duration">
                {lesson.durationMinutes} min
              </span>
            </Link>
          );
        })}
      </section>

    </div>
  );
}
