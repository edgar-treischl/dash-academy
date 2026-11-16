import { memo, useState } from "react";
import { BarPlot } from "@edgar-treischl/dash-ui";
import { HelpCircle } from "lucide-react";
import { useGuidedTour } from "../hooks/useGuidedTour";
import { RETENTION_TOUR_ID, retentionTourSteps } from "../tours/retentionTour";
import "../styles/retention.css";

type SchoolType = "GS" | "MS" | "RS" | "GY" | "IGS";
type SchoolYear = "2022/23" | "2023/24" | "2024/25";

const SCHOOL_TYPE_LABELS: Record<SchoolType, string> = {
  GS: "Grundschulen",
  MS: "Mittelschulen",
  RS: "Realschulen",
  GY: "Gymnasien",
  IGS: "Int. Gesamtschulen",
};

const SCHOOL_TYPE_COLORS: Record<SchoolType, string> = {
  GS: "#264653",
  MS: "#2a9d8f",
  RS: "#e9c46a",
  GY: "#f4a261",
  IGS: "#e76f51",
};

const SCHOOL_TYPES: SchoolType[] = ["GS", "MS", "RS", "GY", "IGS"];

const DATA_BY_YEAR: Record<
  SchoolYear,
  Array<{ type: SchoolType; count: number; percent: number }>
> = {
  "2022/23": [
    { type: "GS", count: 150, percent: 8.5 },
    { type: "MS", count: 95, percent: 6.2 },
    { type: "RS", count: 45, percent: 3.8 },
    { type: "GY", count: 22, percent: 1.5 },
    { type: "IGS", count: 18, percent: 2.1 },
  ],
  "2023/24": [
    { type: "GS", count: 165, percent: 9.2 },
    { type: "MS", count: 102, percent: 6.8 },
    { type: "RS", count: 52, percent: 4.1 },
    { type: "GY", count: 25, percent: 1.8 },
    { type: "IGS", count: 20, percent: 2.3 },
  ],
  "2024/25": [
    { type: "GS", count: 172, percent: 9.8 },
    { type: "MS", count: 108, percent: 7.1 },
    { type: "RS", count: 58, percent: 4.5 },
    { type: "GY", count: 28, percent: 2.0 },
    { type: "IGS", count: 22, percent: 2.6 },
  ],
};

function RetentionPageComponent() {
  const [selectedYear, setSelectedYear] = useState<SchoolYear>("2024/25");
  const [activeTab, setActiveTab] = useState<"befund" | "hinweis">("befund");
  const { startTour } = useGuidedTour({
    tourId: RETENTION_TOUR_ID,
    steps: retentionTourSteps,
  });

  const yearData = DATA_BY_YEAR[selectedYear];

  const getPreviousYear = (year: SchoolYear): SchoolYear | null => {
    const yearMap: Record<SchoolYear, SchoolYear | null> = {
      "2022/23": null,
      "2023/24": "2022/23",
      "2024/25": "2023/24",
    };
    return yearMap[year];
  };

  const calculateYoYChange = (schoolType: SchoolType): number | null => {
    const prevYear = getPreviousYear(selectedYear);
    if (!prevYear) return null;

    const currentData = DATA_BY_YEAR[selectedYear].find(
      (d) => d.type === schoolType
    );
    const previousData = DATA_BY_YEAR[prevYear].find(
      (d) => d.type === schoolType
    );

    if (!currentData || !previousData) return null;
    return currentData.percent - previousData.percent;
  };

  const yoyChanges = SCHOOL_TYPES.map((schoolType) => ({
    type: schoolType,
    change: calculateYoYChange(schoolType),
  }));

  return (
    <div className="class-retention-mfe class-retention-mfe__page-wrapper">
      {/* Page Header */}
      <header className="class-retention-mfe__page-header">
        <div
          className="class-retention-mfe__page-header-content class-retention-mfe__page-header-content--with-actions"
          data-tour="retention-header"
        >
          <div>
            <h1 className="class-retention-mfe__page-title">Klassenwiederholungs App</h1>
            <p className="class-retention-mfe__page-description">
              Analyse der Schülerwiederholungen nach Schulart und Schuljahr
            </p>
          </div>
          <button
            type="button"
            className="class-retention-mfe__tour-button"
            onClick={startTour}
          >
            <HelpCircle size={16} aria-hidden="true" />
            Tour starten
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="class-retention-mfe__page-content">
        {/* Main explorer layout */}
        <section className="class-retention-mfe__explorer-layout">
          {/* Left column: Chart */}
          <div className="class-retention-mfe__explorer-left">
            <div className="class-retention-mfe__chart-card">
              <div className="class-retention-mfe__card-heading" />

              {/* Controls section */}
              <div className="class-retention-mfe__controls-section">
                <div
                  className="class-retention-mfe__control-group"
                  data-tour="retention-year-select"
                >
                  <label
                    htmlFor="year-select"
                    className="class-retention-mfe__control-label"
                  >
                    <span>Schuljahr wählen:</span>
                  </label>
                  <select
                    id="year-select"
                    value={selectedYear}
                    onChange={(e) =>
                      setSelectedYear(e.target.value as SchoolYear)
                    }
                    className="class-retention-mfe__control-select"
                  >
                    <option value="2022/23">2022/23</option>
                    <option value="2023/24">2023/24</option>
                    <option value="2024/25">2024/25</option>
                  </select>
                </div>
              </div>

              {/* Chart frame */}
              <div
                className="class-retention-mfe__chart-frame"
                data-tour="retention-chart"
              >
                <BarPlot data={yearData} year={selectedYear} />
              </div>

              {/* Legend */}
              <div
                className="class-retention-mfe__chart-legend"
                data-tour="retention-legend"
              >
                <div className="class-retention-mfe__legend-label">Schularten</div>
                <ul className="class-retention-mfe__legend-list">
                  {SCHOOL_TYPES.map((schoolType) => (
                    <li key={schoolType}>
                      <span
                        className="class-retention-mfe__legend-swatch"
                        style={{
                          backgroundColor: SCHOOL_TYPE_COLORS[schoolType],
                        }}
                      />
                      {schoolType} ({SCHOOL_TYPE_LABELS[schoolType]})
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Right column: Interpretation */}
          <div className="class-retention-mfe__explorer-right">
            <div
              className="class-retention-mfe__story-card class-retention-mfe__story-card--tall"
              data-tour="retention-interpretation"
            >
              <div className="class-retention-mfe__story-header">
                <h3 className="class-retention-mfe__story-heading">
                  Interpretation
                </h3>
              </div>

              {/* Tab navigation */}
              <div className="class-retention-mfe__story-tabs">
                <button
                  className={`class-retention-mfe__story-tab ${
                    activeTab === "befund"
                      ? "class-retention-mfe__story-tab--active"
                      : ""
                  }`}
                  onClick={() => setActiveTab("befund")}
                  type="button"
                >
                  Befund
                </button>
                <button
                  className={`class-retention-mfe__story-tab ${
                    activeTab === "hinweis"
                      ? "class-retention-mfe__story-tab--active"
                      : ""
                  }`}
                  onClick={() => setActiveTab("hinweis")}
                  type="button"
                >
                  Hinweis
                </button>
              </div>

              {/* Tab content */}
              <div className="class-retention-mfe__story-content">
                {activeTab === "befund" && (
                  <div>
                    <p className="class-retention-mfe__story-text">
                      Wie unterscheiden sich Schularten nach Wiederholungsquoten?
                      Das Balkendiagramm zeigt die Anteile der Schülerinnen und
                      Schüler, die in verschiedenen Schultypen in Bayern Klassen
                      wiederholen.
                    </p>
                    <ul
                      className="class-retention-mfe__story-text"
                      style={{ paddingLeft: "1.5rem" }}
                    >
                      <li>
                        <strong>Grundschulen (GS):</strong> Mit {yearData[0]?.percent}
                        % die höchste Wiederholungsquote aller Schularten. Dies
                        deutet darauf hin, dass Grundschüler häufiger
                        Schwierigkeiten in den Grundkompetenzen haben.
                      </li>
                      <li>
                        <strong>Mittelschulen (MS):</strong> Mit {yearData[1]?.percent}
                        % deutlich niedriger als Grundschulen, aber noch erheblich
                        höher als an Gymnasien. Ein moderater Anteil der Schüler
                        wiederholt.
                      </li>
                      <li>
                        <strong>Realschulen (RS):</strong> Mit {yearData[2]?.percent}
                        % zeigt sich ein moderater Wiederholungsanteil zwischen
                        Mittel- und Gymnasialbereich.
                      </li>
                      <li>
                        <strong>Gymnasien (GY):</strong> Mit {yearData[3]?.percent}
                        % die niedrigste Wiederholungsquote. Gymnasien haben eine
                        Selektionsfunktion bei der Aufnahme.
                      </li>
                      <li>
                        <strong>Integrierte Gesamtschulen (IGS):</strong> Mit{" "}
                        {yearData[4]?.percent}% ein niedriger Wiederholungsanteil
                        ähnlich wie Gymnasien.
                      </li>
                    </ul>
                  </div>
                )}

                {activeTab === "hinweis" && (
                  <div>
                    <p className="class-retention-mfe__story-text class-retention-mfe__story-text--italic">
                      Betroffene Kinder erleben häufiger Leistungsängste,
                      geringeres Selbstvertrauen sowie ein erhöhtes Risiko für
                      Schulabbrüche. Hohe Wiederholungsquoten können daher ein
                      Hinweis darauf sein, dass bestehende Leistungsanforderungen
                      nicht ausreichend durch präventive Förderung,
                      individualisierte Unterstützung und adaptive Lernangebote
                      abgefedert werden.
                    </p>
                    <p className="class-retention-mfe__story-text">
                      <strong>Empfohlene Maßnahmen:</strong>
                    </p>
                    <ul
                      className="class-retention-mfe__story-text"
                      style={{ paddingLeft: "1.5rem" }}
                    >
                      <li>
                        Frühe Identifikation von Schülerinnen und Schülern mit
                        Lernrückständen
                      </li>
                      <li>
                        Individualisierte Förderung und spezialisierte
                        Unterstützung
                      </li>
                      <li>
                        Zusammenarbeit zwischen Schulen, Familien und Fachleuten
                      </li>
                      <li>Prävention durch adaptive Unterrichtsgestaltung</li>
                      <li>
                        Regelmäßige Fortbildungen für Lehrkräfte im Umgang mit
                        heterogenen Lerngruppen
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Statistics section */}
        <section
          className="class-retention-mfe__stats-section"
          data-tour="retention-trend"
        >
          <h3 className="class-retention-mfe__stats-header">
            Trend im Vergleich zum Vorjahr
          </h3>
          <div
            className="class-retention-mfe__stats-row"
            aria-label="Veränderungen zum Vorjahr"
          >
            {yoyChanges.map(({ type, change }) => (
              <section
                key={type}
                className="class-retention-mfe__stat-card"
              >
                <span className="class-retention-mfe__stat-type">{type}</span>
                <strong
                  className={
                    change === null
                      ? ""
                      : change > 0
                        ? "class-retention-mfe__stat-increase"
                        : change < 0
                          ? "class-retention-mfe__stat-decrease"
                          : ""
                  }
                >
                  {change === null
                    ? "N/A"
                    : `${change > 0 ? "+" : ""}${change.toFixed(1)}%`}
                </strong>
              </section>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default memo(RetentionPageComponent);
