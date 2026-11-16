import { useProgressStore } from "../stores/progressStore";

export default function SettingsPage() {
  const resetProgress = useProgressStore((s) => s.resetProgress);

  const handleResetProgress = () => {
    if (
      window.confirm(
        "Are you sure you want to reset all progress? This cannot be undone."
      )
    ) {
      resetProgress();
      alert("Progress has been reset!");
    }
  };

  return (
    <div className="learning-page learning-page--settings">
      <header className="learning-page-header">
        <h1>Settings</h1>
        <p>Manage your learning preferences</p>
      </header>

      <main className="learning-page-content">
        <section className="mfe-academy-settings-section">
          <h2>Learning Preferences</h2>
          <div className="mfe-academy-settings-option">
            <label>
              <input type="checkbox" defaultChecked />
              Enable notifications
            </label>
          </div>
          <div className="mfe-academy-settings-option">
            <label>
              <input type="checkbox" defaultChecked />
              Show progress in sidebar
            </label>
          </div>
        </section>

        <section className="mfe-academy-settings-section">
          <h2>Data & Privacy</h2>
          <div className="mfe-academy-settings-option">
            <label>
              <input type="checkbox" defaultChecked />
              Allow tracking of learning patterns
            </label>
          </div>
        </section>

        <section className="mfe-academy-settings-section mfe-academy-danger-zone">
          <h2>Danger Zone</h2>
          <p>These actions cannot be undone.</p>
          <button
            className="mfe-academy-btn mfe-academy-btn--danger"
            onClick={handleResetProgress}
          >
            Reset All Progress
          </button>
        </section>
      </main>
    </div>
  );
}
