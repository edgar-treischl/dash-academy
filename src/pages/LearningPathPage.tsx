
import { Link } from "react-router-dom";
import { modules, learningPath, achievements } from "../data/learning";
import { useProgressStore } from "../stores/progressStore";
import { useState, useEffect } from "react";
import { getLesson } from "../utils/lessonLoader";
import pieImage from "../assets/next.svg";
import fallbackImage from "../assets/fallback.svg";
import type { Lesson } from "../types/learning";
import LearningScoreCard from "../components/LearningScoreCard";

export default function LearningPathPage() {
  const completed = useProgressStore(
    (state) => state.completedLessonIds
  );

  const earnedAchievementIds = useProgressStore(
    (state) => state.earnedAchievementIds
  );

  const currentLessonId = useProgressStore(
    (state) => state.currentLessonId
  );

  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);

  useEffect(() => {
    if (!currentLessonId) return;

    let active = true;

    const loadCurrentLesson = async () => {
      try {
        for (const mod of modules) {
          if (mod.lessonIds.includes(currentLessonId)) {
            const lesson = await getLesson(mod.id, currentLessonId);
            if (active && lesson) {
              setCurrentLesson(lesson);
            }
            break;
          }
        }
      } catch (err) {
        console.error("Error loading current lesson:", err);
      }
    };

    loadCurrentLesson();
    return () => {
      active = false;
    };
  }, [currentLessonId]);

  const lessonIds = [...new Set(modules.flatMap((module) => module.lessonIds))];
  const completedLessons = lessonIds.filter((id) => completed.includes(id)).length;
  const completedModules = modules.filter(
    (module) => module.lessonIds.length > 0 &&
      module.lessonIds.every((id) => completed.includes(id))
  ).length;
  const earnedAchievements = achievements.filter(
    (achievement) => earnedAchievementIds.includes(achievement.id)
  );

  return (
    <div className="learning-page learning-page--path">

      <header>
        
        <p className="learning-eyebrow learning-link">
          Lernpfad
        </p>

        <h1 className="learning-title">
          {learningPath.title}
        </h1>

        <p className="learning-description">
          {learningPath.description}
        </p>
      </header>

      <section className="learning-hero">
        <LearningScoreCard
          name="Alex"
          completedLessons={completedLessons}
          totalLessons={lessonIds.length}
          completedModules={completedModules}
          totalModules={modules.length}
          earnedAchievements={earnedAchievements}
          totalAchievements={achievements.length}
        />
      </section>

      {currentLesson && currentLesson.id === currentLessonId && (
        <section className="learning-continue-section">
          <h2 className="learning-section-title">
            Weiterlernen
          </h2>

          <Link
            to={`/lessons/${currentLesson.id}`}
            className="learning-continue-featured"
          >
            <div className="learning-continue-featured-image">
              <img src={pieImage} alt="" className="learning-continue-featured-image-content" />
            </div>

            <div className="learning-continue-featured-content">
              <p className="learning-link">
                Aktuelle Lektion
              </p>

              <h3 className="learning-card-title">
                {currentLesson.title}
              </h3>

              <p className="learning-card-description">
                {currentLesson.description}
              </p>

              <span className="learning-card-action">
                Weiter zur Lektion →
              </span>
            </div>
          </Link>

          <h3 className="learning-continue-subheading">
            Module erkunden
          </h3>

          <div className="learning-continue-grid">
            {modules.map((module, index) => {
              const finished = module.lessonIds.filter(
                (lessonId) => completed.includes(lessonId)
              ).length;

              const isLocked =
                index > 0 &&
                !modules
                  .slice(0, index)
                  .every((previous) =>
                    previous.lessonIds.every((id) =>
                      completed.includes(id)
                    )
                  );

              return (
                <Link
                  key={module.id}
                  to={isLocked ? "#" : `/modules/${module.id}`}
                  onClick={(e) => isLocked && e.preventDefault()}
                  className="learning-continue-card"
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                    cursor: isLocked ? "not-allowed" : "pointer",
                    opacity: isLocked ? 0.6 : 1
                  }}
                >
                  <div className="learning-continue-image">
                    <img 
                      src={module.previewImage || fallbackImage} 
                      alt={module.title} 
                      className="learning-continue-image-content" 
                    />
                  </div>

                  <div className="learning-continue-content">
                    <p className="learning-meta">
                      Modul {String(index + 1).padStart(2, "0")}
                    </p>

                    <h3 className="learning-card-title">
                      {module.title}
                    </h3>

                    <p className="learning-card-description">
                      {module.description}
                    </p>

                    <div className="learning-continue-progress">
                      <div className="learning-meter">
                        <div
                          className="learning-meter-fill"
                          style={{
                            width: `${
                              (finished / module.lessonIds.length) * 100
                            }%`
                          }}
                        />
                      </div>
                      <span className="learning-meta">
                        {finished}/{module.lessonIds.length} Lektionen
                      </span>
                    </div>

                    <span className="learning-card-action">
                      Zum Modul →
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}



      <section>
        <h2 className="learning-section-title">
          Deine Erfolge
        </h2>

        <p className="learning-section-subtitle">
          Deine verdienten Abzeichen und die nächsten Meilensteine.
        </p>

        <div className="achievements-grid">
          {achievements.map((achievement) => {
            const isEarned = earnedAchievementIds.includes(
              achievement.id
            );
            return (
              <div
                key={achievement.id}
                className={`achievement-card${
                  isEarned ? " achievement-card--earned" : " achievement-card--locked"
                }`}
              >
                {achievement.image ? (
                  <div className="achievement-image">
                    <img 
                      src={achievement.image} 
                      alt=""
                      className="achievement-image-content"
                    />
                  </div>
                ) : (
                  <div className="achievement-icon" aria-hidden="true">
                    {isEarned ? achievement.fallbackIcon || "🏅" : "🔒"}
                  </div>
                )}
                <p className="achievement-status">
                  {isEarned ? "Erreicht" : "Noch nicht erreicht"}
                </p>
                <h3>{achievement.title}</h3>
                <p>{achievement.description}</p>
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
}
