"use client";
import { useState, useSyncExternalStore } from "react";
import Setup from "./Setup";
import UltimateTracker from "./UltimateTracker";
import { loadProfile, saveProfile, loadLog } from "@/lib/storage";
import type { Profile, LogEntry } from "@/lib/types";

export default function Credits() {
  const hydrated = useSyncExternalStore(() => () => {}, () => true, () => false);
  const [sessionProfile, setSessionProfile] = useState<Profile | null>(null);
  const storedProfile = hydrated ? loadProfile() : null;
  const profile = sessionProfile ?? storedProfile;
  const legacyLog: LogEntry[] = hydrated ? loadLog() : [];
  if (!profile) return (
    <div className={hydrated ? "" : "setup-pending"} data-setup-ready={hydrated ? "true" : "false"} aria-busy={!hydrated}>
      <Setup onComplete={(next) => { saveProfile(next); setSessionProfile(next); }} />
    </div>
  );
  return <UltimateTracker profile={profile} legacyLog={legacyLog} onProfile={(next) => { saveProfile(next); setSessionProfile(next); }} />;
}
