"use client";
import { useState } from "react";
import { ACTIVITIES, GOALS, ACCENT } from "@/lib/constants";
import { calcTDEE } from "@/lib/calc";
import type { Profile } from "@/lib/types";

interface SetupProps {
  onComplete: (profile: Profile) => void;
}

const EMPTY: Profile = {
  name: "",
  gender: "male",
  age: 0,
  weight: 0,
  height: 0,
  activityLevel: "moderate",
  goal: "maintain",
  useManual: false,
  manualCal: 0,
  lossRate: 0.5,
};

const LOSS_RATE_OPTIONS = [
  { rate: 0.25, label: "Mild",       desc: "0.25 kg/week" },
  { rate: 0.5,  label: "Moderate",   desc: "0.5 kg/week"  },
  { rate: 0.75, label: "Active",     desc: "0.75 kg/week" },
  { rate: 1.0,  label: "Aggressive", desc: "1.0 kg/week"  },
];

// Module-level constants
const CARD: React.CSSProperties = { background: "#121212", border: "1px solid #292929", borderRadius: 20 };
const INPUT: React.CSSProperties = {
  background: "#151515",
  border: "1px solid #303030",
  borderRadius: 10,
  color: "#f0f0f0",
  fontFamily: "var(--font-dm-sans)",
  fontSize: 16,
  padding: "12px 14px",
  width: "100%",
  outline: "none",
};

function btnPrimary(disabled?: boolean): React.CSSProperties {
  return {
    background: disabled ? "#292929" : ACCENT,
    color: disabled ? "#a0a0a0" : "#1a1a1a",
    border: "none",
    borderRadius: 12,
    fontFamily: "var(--font-dm-sans)",
    fontWeight: 600,
    fontSize: 15,
    padding: "14px 0",
    width: "100%",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.35 : 1,
  };
}

export default function Setup({ onComplete }: SetupProps) {
  const [step, setStep] = useState(0);
  const [showLossRate, setShowLossRate] = useState(false);
  const [p, setP] = useState<Profile>(EMPTY);

  const set = (k: keyof Profile, v: unknown) => setP((prev) => ({ ...prev, [k]: v }));

  const preview = calcTDEE(p);
  const canStep0 = p.name.trim().length > 0;
  const canStep1 = p.age > 0 && p.weight > 0 && p.height > 0;

  const segCount = p.goal === "lose" ? 5 : 4;
  const currentSeg = showLossRate ? 4 : step;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#0B0B0B", padding: "0 20px", paddingBottom: 32 }}>
      {step > 0 && (
        <div className="pt-safe pt-10 pb-4">
          <div className="flex gap-2">
            {Array.from({ length: segCount }, (_, i) => i + 1).map((s) => (
              <div
                key={s}
                className="flex-1 h-1 rounded-full"
                style={{ background: currentSeg >= s ? ACCENT : "#292929", transition: "background 0.3s" }}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── Step 0: Welcome ── */}
      {step === 0 && (
        <div className="flex flex-col items-center justify-center min-h-screen gap-6 anim-fade-up">
          <div className="text-7xl">💰</div>
          <div>
            <h1 className="text-center" style={{ fontFamily: "var(--font-bebas)", fontSize: 64, color: ACCENT, lineHeight: 1, letterSpacing: 2 }}>
              CREDITS
            </h1>
            <p className="text-center mt-2" style={{ color: "#a0a0a0", fontFamily: "var(--font-dm-sans)", fontSize: 15 }}>
              Track your daily calorie budget — spend wisely.
            </p>
          </div>

          <div style={{ width: "100%", maxWidth: 360 }} className="flex flex-col gap-4">
            <div>
              <label htmlFor="setup-name" style={{ color: "#a0a0a0", fontFamily: "var(--font-dm-sans)", fontSize: 13, display: "block", marginBottom: 6 }}>
                Your Name
              </label>
              <input id="setup-name" type="text" placeholder="e.g. Alex" value={p.name} onChange={(e) => set("name", e.target.value)} style={INPUT} />
            </div>

            <div>
              <label style={{ color: "#a0a0a0", fontFamily: "var(--font-dm-sans)", fontSize: 13, display: "block", marginBottom: 6 }}>
                Gender
              </label>
              <div className="flex gap-3">
                {(["male", "female"] as const).map((g) => (
                  <button
                    key={g}
                    onClick={() => set("gender", g)}
                    style={{
                      flex: 1,
                      padding: "12px 0",
                      borderRadius: 10,
                      border: `1px solid ${p.gender === g ? ACCENT : "#292929"}`,
                      background: p.gender === g ? `${ACCENT}18` : "#121212",
                      color: p.gender === g ? ACCENT : "#a0a0a0",
                      fontFamily: "var(--font-dm-sans)",
                      fontWeight: 500,
                      fontSize: 14,
                      cursor: "pointer",
                      textTransform: "capitalize",
                    }}
                  >
                    {g === "male" ? "♂ Male" : "♀ Female"}
                  </button>
                ))}
              </div>
            </div>

            <button onClick={() => canStep0 && setStep(1)} style={btnPrimary(!canStep0)}>
              Get Started →
            </button>
          </div>
        </div>
      )}

      {/* ── Step 1: Body Metrics ── */}
      {step === 1 && !showLossRate && (
        <div className="flex flex-col gap-6 pt-6 anim-fade-up">
          <div>
            <h2 style={{ fontFamily: "var(--font-bebas)", fontSize: 34, color: "#f0f0f0", letterSpacing: 1 }}>Body Metrics</h2>
            <p style={{ color: "#a0a0a0", fontFamily: "var(--font-dm-sans)", fontSize: 13, marginTop: 4 }}>
              Used with the Mifflin-St Jeor formula to calculate your daily calorie needs.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="setup-age" style={{ color: "#a0a0a0", fontFamily: "var(--font-dm-sans)", fontSize: 13, display: "block", marginBottom: 6 }}>Age (years)</label>
              <input id="setup-age" type="number" placeholder="25" value={p.age || ""} onChange={(e) => set("age", Number(e.target.value))} style={INPUT} />
            </div>
            <div>
              <label htmlFor="setup-weight" style={{ color: "#a0a0a0", fontFamily: "var(--font-dm-sans)", fontSize: 13, display: "block", marginBottom: 6 }}>Weight (kg)</label>
              <input id="setup-weight" type="number" placeholder="70" value={p.weight || ""} onChange={(e) => set("weight", Number(e.target.value))} style={INPUT} />
            </div>
          </div>

          <div>
            <label htmlFor="setup-height" style={{ color: "#a0a0a0", fontFamily: "var(--font-dm-sans)", fontSize: 13, display: "block", marginBottom: 6 }}>Height (cm)</label>
            <input id="setup-height" type="number" placeholder="175" value={p.height || ""} onChange={(e) => set("height", Number(e.target.value))} style={INPUT} />
          </div>

          <div className="flex gap-3 mt-auto">
            <button onClick={() => setStep(0)} style={{ ...btnPrimary(false), background: "#121212", border: "1px solid #292929", color: "#f0f0f0", flex: "0 0 auto", width: 56 }}>←</button>
            <button onClick={() => canStep1 && setStep(2)} style={{ ...btnPrimary(!canStep1), flex: 1 }}>Next</button>
          </div>
        </div>
      )}

      {/* ── Step 2: Activity Level ── */}
      {step === 2 && !showLossRate && (
        <div className="flex flex-col gap-4 pt-6 anim-fade-up">
          <div>
            <h2 style={{ fontFamily: "var(--font-bebas)", fontSize: 34, color: "#f0f0f0", letterSpacing: 1 }}>Activity Level</h2>
            <p style={{ color: "#a0a0a0", fontFamily: "var(--font-dm-sans)", fontSize: 13, marginTop: 4 }}>
              How active are you on a typical week?
            </p>
          </div>

          <div className="flex flex-col gap-2">
            {ACTIVITIES.map((a) => {
              const sel = p.activityLevel === a.id;
              return (
                <button
                  key={a.id}
                  onClick={() => set("activityLevel", a.id)}
                  style={{
                    ...CARD,
                    background: sel ? `${ACCENT}18` : "#121212",
                    border: `1px solid ${sel ? ACCENT : "#292929"}`,
                    padding: "14px 16px",
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  <span style={{ fontSize: 22 }}>{a.icon}</span>
                  <div>
                    <div style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 600, color: sel ? ACCENT : "#f0f0f0", fontSize: 14 }}>{a.label}</div>
                    <div style={{ fontFamily: "var(--font-dm-sans)", color: "#a0a0a0", fontSize: 12 }}>{a.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex gap-3">
            <button onClick={() => setStep(1)} style={{ ...btnPrimary(false), background: "#121212", border: "1px solid #292929", color: "#f0f0f0", flex: "0 0 auto", width: 56 }}>←</button>
            <button onClick={() => setStep(3)} style={{ ...btnPrimary(false), flex: 1 }}>Next</button>
          </div>
        </div>
      )}

      {/* ── Step 3: Goal + Calorie Method ── */}
      {step === 3 && !showLossRate && (
        <div className="flex flex-col gap-5 pt-6 anim-fade-up">
          <div>
            <h2 style={{ fontFamily: "var(--font-bebas)", fontSize: 34, color: "#f0f0f0", letterSpacing: 1 }}>Your Goal</h2>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {GOALS.map((g) => {
              const sel = p.goal === g.id;
              return (
                <button
                  key={g.id}
                  onClick={() => set("goal", g.id)}
                  style={{
                    ...CARD,
                    background: sel ? `${ACCENT}18` : "#121212",
                    border: `1px solid ${sel ? ACCENT : "#292929"}`,
                    padding: "16px 14px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    gap: 6,
                    cursor: "pointer",
                  }}
                >
                  <span style={{ fontSize: 24 }}>{g.icon}</span>
                  <div style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 600, color: sel ? ACCENT : "#f0f0f0", fontSize: 13 }}>{g.label}</div>
                  <div style={{ fontFamily: "var(--font-dm-sans)", color: "#a0a0a0", fontSize: 11 }}>{g.desc}</div>
                </button>
              );
            })}
          </div>

          <div style={{ ...CARD, padding: 16 }}>
            <div className="flex justify-between items-center">
              <div>
                <div style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 600, color: "#f0f0f0", fontSize: 14 }}>Custom calorie limit</div>
                {!p.useManual && (
                  <div style={{ fontFamily: "var(--font-dm-sans)", color: "#a0a0a0", fontSize: 12, marginTop: 2 }}>
                    Auto: <span style={{ color: ACCENT, fontFamily: "var(--font-bebas)", fontSize: 16 }}>~{preview.toLocaleString()}</span> cal/day
                  </div>
                )}
              </div>
              <button
                onClick={() => set("useManual", !p.useManual)}
                style={{ width: 44, height: 24, borderRadius: 12, background: p.useManual ? ACCENT : "#292929", border: "none", cursor: "pointer", position: "relative", transition: "background 0.2s" }}
              >
                <span style={{ position: "absolute", top: 2, left: p.useManual ? 22 : 2, width: 20, height: 20, borderRadius: 10, background: "#f0f0f0", transition: "left 0.2s" }} />
              </button>
            </div>
            {p.useManual && (
              <div className="mt-3">
                <input type="number" placeholder="e.g. 2100" value={p.manualCal || ""} onChange={(e) => set("manualCal", Number(e.target.value))} style={{ ...INPUT, marginTop: 4 }} />
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button onClick={() => setStep(2)} style={{ ...btnPrimary(false), background: "#121212", border: "1px solid #292929", color: "#f0f0f0", flex: "0 0 auto", width: 56 }}>←</button>
            <button
              onClick={() => { if (p.goal === "lose") { setShowLossRate(true); } else { onComplete(p); } }}
              style={{ ...btnPrimary(false), flex: 1 }}
            >
              {p.goal === "lose" ? "Next →" : "Start Tracking 🔥"}
            </button>
          </div>
        </div>
      )}

      {/* ── Step 3.5: Loss Rate ── */}
      {showLossRate && (
        <div className="flex flex-col gap-5 pt-6 anim-fade-up">
          <div>
            <h2 style={{ fontFamily: "var(--font-bebas)", fontSize: 34, color: "#f0f0f0", letterSpacing: 1 }}>Weight Loss Rate</h2>
            <p style={{ color: "#a0a0a0", fontFamily: "var(--font-dm-sans)", fontSize: 13, marginTop: 4 }}>
              How fast do you want to lose weight? Slower = more sustainable.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {LOSS_RATE_OPTIONS.map((opt) => {
              const sel = (p.lossRate ?? 0.5) === opt.rate;
              const deficit = Math.round(opt.rate * 1000);
              return (
                <button
                  key={opt.rate}
                  onClick={() => set("lossRate", opt.rate)}
                  style={{
                    ...CARD,
                    background: sel ? `${ACCENT}18` : "#121212",
                    border: `1px solid ${sel ? ACCENT : "#292929"}`,
                    padding: 16,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  <div>
                    <div style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 600, color: sel ? ACCENT : "#f0f0f0", fontSize: 15 }}>{opt.label}</div>
                    <div style={{ fontFamily: "var(--font-dm-sans)", color: "#a0a0a0", fontSize: 13, marginTop: 2 }}>{opt.desc}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontFamily: "var(--font-bebas)", fontSize: 20, color: sel ? ACCENT : "#a0a0a0" }}>-{deficit}</div>
                    <div style={{ fontFamily: "var(--font-dm-sans)", color: "#808080", fontSize: 11 }}>cal/day deficit</div>
                  </div>
                </button>
              );
            })}
          </div>

          <div style={{ ...CARD, padding: "14px 16px", background: "#151515" }}>
            <div style={{ fontFamily: "var(--font-dm-sans)", color: "#a0a0a0", fontSize: 12 }}>Estimated daily calorie target</div>
            <div style={{ fontFamily: "var(--font-bebas)", fontSize: 28, color: ACCENT, marginTop: 2 }}>~{preview.toLocaleString()} cal/day</div>
          </div>

          <div className="flex gap-3">
            <button onClick={() => setShowLossRate(false)} style={{ ...btnPrimary(false), background: "#121212", border: "1px solid #292929", color: "#f0f0f0", flex: "0 0 auto", width: 56 }}>←</button>
            <button onClick={() => onComplete(p)} style={{ ...btnPrimary(false), flex: 1 }}>Start Tracking 🔥</button>
          </div>
        </div>
      )}
    </div>
  );
}
