import avatar from "../assets/avatar.svg";
import type { Achievement } from "../types/learning";
import { Zap, BookOpen, Award, Trophy } from "lucide-react";

type LearningScoreCardProps = {
  name: string;
  completedLessons: number;
  totalLessons: number;
  completedModules: number;
  totalModules: number;
  earnedAchievements: Achievement[];
  totalAchievements: number;
};

const TRACK_LEVELS = [
  { name: "Fundamentals", icon: "🧱", minPercentage: 0 },
  { name: "Novice", icon: "👨‍🎓", minPercentage: 15 },
  { name: "Practitioner", icon: "💼", minPercentage: 30 },
  { name: "Expert", icon: "🧠", minPercentage: 50 },
  { name: "Master", icon: "🏆", minPercentage: 75 }
];

export default function LearningScoreCard({
  name,
  completedLessons,
  totalLessons,
  completedModules,
  totalModules,
  earnedAchievements,
  totalAchievements
}: LearningScoreCardProps) {
  const percentage = totalLessons > 0
    ? Math.round((completedLessons / totalLessons) * 100)
    : 0;
  const track = TRACK_LEVELS.findLast(
    (level) => percentage >= level.minPercentage
  ) ?? TRACK_LEVELS[0];

  return (
    <section className="learning-score-card" aria-label={`Lernbilanz von ${name}`}>
      <div className="learning-score-card-profile">
        <img className="learning-score-card-avatar" src={avatar} alt="" />
        <div className="learning-score-card-identity">
          <h2>{name}</h2>
          <p>Deine Lernbilanz</p>
          <span className="learning-score-card-level">
            <Zap size={20} strokeWidth={2.5} />
            <span>Track: {track.name}</span>
          </span>
        </div>
      </div>

      <div className="learning-score-card-results">
        <dl className="learning-score-card-stats">
          <div>
            <dt className="learning-score-card-stats-item">
              <BookOpen size={24} strokeWidth={2} />
              <span>Lektionen geschafft</span>
            </dt>
            <dd>{completedLessons}<span> / {totalLessons}</span></dd>
          </div>
          <div>
            <dt className="learning-score-card-stats-item">
              <Trophy size={24} strokeWidth={2} />
              <span>Module abgeschlossen</span>
            </dt>
            <dd>{completedModules}<span> / {totalModules}</span></dd>
          </div>
          <div>
            <dt className="learning-score-card-stats-item">
              <Award size={24} strokeWidth={2} />
              <span>Erfolge gesammelt</span>
            </dt>
            <dd>{earnedAchievements.length}<span> / {totalAchievements}</span></dd>
          </div>
        </dl>

        <div className="learning-score-card-progress">
          <div className="learning-score-card-progress-label">
            <span>Lernfortschritt</span>
            <strong>{percentage}%</strong>
          </div>
          <div
            className="learning-meter learning-score-card-meter"
            role="progressbar"
            aria-label="Lernfortschritt"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={percentage}
            aria-valuetext={`${completedLessons} von ${totalLessons} Lektionen abgeschlossen`}
          >
            <div
              className="learning-meter-fill"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </div>

      <div className="learning-score-card-achievements">
        <h3>Deine Abzeichen</h3>
        {earnedAchievements.length > 0 ? (
          <ul className="learning-score-card-badges">
            {earnedAchievements.map((achievement) => (
              <li key={achievement.id}>
                {achievement.image ? (
                  <img src={achievement.image} alt="" />
                ) : (
                  <span className="learning-score-card-badge-icon" aria-hidden="true">
                    {achievement.fallbackIcon || "🏅"}
                  </span>
                )}
                <div>
                  <strong>{achievement.title}</strong>
                  <p>{achievement.description}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="learning-score-card-empty">
            Noch keine Abzeichen. Deine gesammelten Erfolge erscheinen hier.
          </p>
        )}
      </div>
    </section>
  );
}
