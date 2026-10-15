"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

type MotionPreferences = {
  reducedMotion: boolean;
  systemReducedMotion: boolean;
  toggleReducedMotion: () => void;
  useSystemPreference: () => void;
};

const MotionPreferencesContext = createContext<MotionPreferences | null>(null);

export function MotionPreferencesProvider({ children }: { children: ReactNode }) {
  const [systemReducedMotion, setSystemReducedMotion] = useState(false);
  const [override, setOverride] = useState<boolean | null>(null);
  const reducedMotion = override ?? systemReducedMotion;

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setSystemReducedMotion(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  const toggleReducedMotion = useCallback(() => {
    setOverride((current) => !(current ?? reducedMotion));
  }, [reducedMotion]);

  const useSystemPreference = useCallback(() => setOverride(null), []);
  const value = useMemo(
    () => ({ reducedMotion, systemReducedMotion, toggleReducedMotion, useSystemPreference }),
    [reducedMotion, systemReducedMotion, toggleReducedMotion, useSystemPreference],
  );

  return <MotionPreferencesContext.Provider value={value}>{children}</MotionPreferencesContext.Provider>;
}

export function useMotionPreferences() {
  const preferences = useContext(MotionPreferencesContext);
  if (!preferences) throw new Error("useMotionPreferences must be used inside MotionPreferencesProvider.");
  return preferences;
}

export function MotionPreferencesControl() {
  const { reducedMotion, systemReducedMotion, toggleReducedMotion, useSystemPreference } = useMotionPreferences();

  return (
    <div className="motion-preferences" role="group" aria-label="Motion preferences">
      <button
        className="button button-secondary motion-toggle"
        type="button"
        aria-pressed={reducedMotion}
        onClick={toggleReducedMotion}
      >
        Reduced motion <span className="motion-toggle-state">{reducedMotion ? "On" : "Off"}</span>
      </button>
      <span className="motion-preference-note" aria-live="polite">
        {overrideLabel(reducedMotion, systemReducedMotion)}
      </span>
      {reducedMotion !== systemReducedMotion && (
        <button className="motion-system-link" type="button" onClick={useSystemPreference}>
          Use system setting
        </button>
      )}
    </div>
  );
}

function overrideLabel(reducedMotion: boolean, systemReducedMotion: boolean) {
  if (reducedMotion === systemReducedMotion) return `Following system setting: ${systemReducedMotion ? "reduced" : "full"} motion`;
  return `Manual setting: ${reducedMotion ? "reduced" : "full"} motion`;
}
