"use client";

import { useState, useEffect } from "react";
import { Skelly } from "use-skelly/react";

export default function MorphingDemoCard() {
  const [loading, setLoading] = useState(true);

  // Toggle loading state every 2.6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setLoading((prev) => !prev);
    }, 2600);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ position: "relative" }}>
      <div style={{
        position: "absolute",
        inset: "-40px",
        background: "radial-gradient(ellipse at 60% 40%, rgba(79,70,229,.09), transparent 65%)",
        pointerEvents: "none"
      }} />
      <div style={{
        position: "relative",
        background: "#fff",
        border: "1px solid rgba(28,28,26,.09)",
        borderRadius: "16px",
        boxShadow: "0 12px 40px rgba(28,28,26,.09)",
        overflow: "hidden",
        animation: "skFloat 7s ease-in-out infinite"
      }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 16px",
          borderBottom: "1px solid rgba(28,28,26,.07)"
        }}>
          <div style={{ display: "flex", gap: "6px" }}>
            <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#E4E2DC" }} />
            <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#E4E2DC" }} />
            <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#E4E2DC" }} />
          </div>
          <div style={{
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: "11px",
            transition: "color .3s",
            color: loading ? "#4F46E5" : "#8A8880"
          }}>
            {loading ? "loading — skeleton by skelly" : "loaded — real component"}
          </div>
        </div>
        
        <div style={{ position: "relative", padding: "22px", height: "298px" }}>
          <Skelly loading={loading} visual="shimmer">
            <div style={{
              display: "flex",
              flexDirection: "column",
              gap: "18px"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg,#4F46E5,#8B7CF0)",
                  flex: "none"
                }} />
                <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                  <div style={{ fontWeight: 600, fontSize: "15px" }}>Amara Osei</div>
                  <div style={{ fontSize: "12.5px", color: "#8A8880" }}>Posted 2 hours ago</div>
                </div>
                <div style={{
                  marginLeft: "auto",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#4F46E5",
                  background: "rgba(79,70,229,.08)",
                  padding: "4px 10px",
                  borderRadius: "99px"
                }}>
                  Follow
                </div>
              </div>
              <div style={{ fontSize: "14px", lineHeight: 1.6, color: "#3A3833" }}>
                Shipped the new onboarding flow today. Conversion is up 12% and the skeleton states made the whole thing feel instant — even on 3G.
              </div>
              <div style={{
                height: "96px",
                borderRadius: "10px",
                background: "repeating-linear-gradient(-45deg, #EDEBE5, #EDEBE5 8px, #F5F4F0 8px, #F5F4F0 16px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "var(--font-jetbrains-mono), monospace",
                fontSize: "11px",
                color: "#8A8880"
              }}>
                cover image
              </div>
              <div style={{ display: "flex", gap: "18px", fontSize: "13px", color: "#8A8880" }}>
                <span>♥ 248</span>
                <span>↻ 31</span>
                <span>✉ 12</span>
              </div>
            </div>
          </Skelly>
        </div>
      </div>
      <div style={{
        textAlign: "center",
        marginTop: "16px",
        fontFamily: "var(--font-jetbrains-mono), monospace",
        fontSize: "11.5px",
        color: "#8A8880"
      }}>
        ← one component. skelly generated the skeleton. →
      </div>
    </div>
  );
}
