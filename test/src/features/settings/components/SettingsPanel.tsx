"use client";
import { THEMES, useTheme } from "../context/ThemeContext";

export default function SettingsPanel({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { theme, setTheme } = useTheme();

  return (
    <>
      {isOpen && (
        <div
          className="settings-backdrop"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <div
        className={`settings-panel${isOpen ? " open" : ""}`}
        role="dialog"
        aria-label="Settings"
        aria-modal="true"
      >
        <div className="settings-panel-header">
          <span>Settings</span>
          <button onClick={onClose} aria-label="Close settings">
            ×
          </button>
        </div>

        <div className="settings-section-label">Theme</div>

        <div className="settings-theme-list">
          {THEMES.map((t) => (
            <button
              key={t.id}
              className={`settings-theme-row${theme === t.id ? " active" : ""}`}
              onClick={() => setTheme(t.id)}
            >
              <span
                className="settings-theme-swatch"
                style={{ background: t.color }}
              />
              {t.label}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
