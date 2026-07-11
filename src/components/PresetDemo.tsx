"use client";

import { useState } from "react";
import { Skelly } from "skellyjs/react";

export default function PresetDemo() {
  const presets = ["dashboard", "article", "feed", "profile", "generic"] as const;
  const [activePreset, setActivePreset] = useState<typeof presets[number]>("dashboard");

  return (
    <div style={{
      border: "1px solid rgba(28, 28, 26, 0.1)",
      borderRadius: "14px",
      overflow: "hidden",
      background: "#fff",
      margin: "24px 0",
      display: "flex",
      flexDirection: "column"
    }}>
      {/* Tabs Header */}
      <div style={{
        display: "flex",
        gap: "6px",
        background: "#F5F4F0",
        padding: "8px 12px",
        borderBottom: "1px solid rgba(28, 28, 26, 0.08)"
      }}>
        {presets.map((p) => {
          const active = activePreset === p;
          return (
            <button
              key={p}
              onClick={() => setActivePreset(p)}
              style={{
                fontFamily: "var(--font-jetbrains-mono), monospace",
                fontSize: "12px",
                padding: "6px 12px",
                borderRadius: "6px",
                border: "none",
                cursor: "pointer",
                background: active ? "#1C1C1A" : "transparent",
                color: active ? "#fff" : "#55534C",
                fontWeight: active ? 600 : 400,
                transition: "all 0.15s ease"
              }}
              className={!active ? "hover-bg-grey" : ""}
            >
              {p}
            </button>
          );
        })}
      </div>

      {/* Demo Container */}
      <div style={{
        position: "relative",
        height: "260px",
        padding: "20px",
        overflow: "hidden"
      }}>
        {/* We mount Skelly in loading state with the active preset */}
        <Skelly loading={true} preset={activePreset} visual="shimmer" style={{ height: "100%" }} />
      </div>
    </div>
  );
}
