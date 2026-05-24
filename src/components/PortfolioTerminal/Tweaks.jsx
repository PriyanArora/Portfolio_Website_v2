/* ─── Tweaks panel ──────────────────────────────────────────────────
   - Shows palette + bg as locked values (final), exposes typing speed
     and header toggle.
   - Opens when host sends `__activate_edit_mode` postMessage.
   - When `alwaysShow` is true the panel is always visible (handy for
     local dev / debugging).
   ─────────────────────────────────────────────────────────────────── */

import React, { useEffect, useState } from "react";

export function useTweaks(defaults) {
  const [state, setState] = useState(defaults);
  function setTweak(keyOrObj, value) {
    const edits = typeof keyOrObj === "object" ? keyOrObj : { [keyOrObj]: value };
    setState((s) => ({ ...s, ...edits }));
    try {
      window.parent.postMessage({ type: "__edit_mode_set_keys", edits }, "*");
    } catch (e) {}
  }
  return [state, setTweak];
}

export default function TweaksUI({ t, setTweak, alwaysShow = false }) {
  const [open, setOpen] = useState(alwaysShow);

  useEffect(() => {
    function onMsg(e) {
      const d = e.data;
      if (!d || typeof d !== "object") return;
      if (d.type === "__activate_edit_mode") setOpen(true);
      if (d.type === "__deactivate_edit_mode") setOpen(alwaysShow);
    }
    window.addEventListener("message", onMsg);
    try { window.parent.postMessage({ type: "__edit_mode_available" }, "*"); } catch (e) {}
    return () => window.removeEventListener("message", onMsg);
  }, [alwaysShow]);

  if (!open) return null;

  return (
    <div className="pt-tweaks">
      <div className="pt-tweaks-head">
        <span>Tweaks</span>
        <button
          className="pt-tweaks-close"
          onClick={() => {
            if (alwaysShow) return;
            setOpen(false);
            try { window.parent.postMessage({ type: "__edit_mode_dismissed" }, "*"); } catch (e) {}
          }}
        >×</button>
      </div>

      <div className="pt-tweaks-section">
        <div className="pt-tweaks-label" style={{ color: "#8a8580" }}>
          <span>Palette</span>
          <span className="pt-tweaks-val">fire (locked)</span>
        </div>
        <div className="pt-tweaks-label" style={{ color: "#8a8580", marginTop: 8 }}>
          <span>Background</span>
          <span className="pt-tweaks-val">#1d0d2e (locked)</span>
        </div>
      </div>

      <div className="pt-tweaks-section">
        <div className="pt-tweaks-label">
          Intro typing speed{" "}
          <span className="pt-tweaks-val">{t.typingSpeed}ms/char</span>
        </div>
        <input
          type="range" min="2" max="120" step="2"
          value={t.typingSpeed}
          onChange={(e) => setTweak("typingSpeed", +e.target.value)}
        />
      </div>

      <div className="pt-tweaks-section">
        <label className="pt-tweaks-toggle">
          <input
            type="checkbox"
            checked={t.showHeader}
            onChange={(e) => setTweak("showHeader", e.target.checked)}
          />
          <span>Show command-list header</span>
        </label>
      </div>
    </div>
  );
}
