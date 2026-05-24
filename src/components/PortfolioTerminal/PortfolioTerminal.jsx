/* ─────────────────────────────────────────────────────────────────────
   PortfolioTerminal — main React component
   Boots into the `npx oh-my-logo` intro, then becomes an interactive
   shell. Drop into any Astro page with `client:load`.
   ───────────────────────────────────────────────────────────────────── */

import React, { useEffect, useState } from "react";
import Terminal from "./Terminal.jsx";
import TweaksUI, { useTweaks } from "./Tweaks.jsx";
import { useKeyboardAudio } from "./keySounds.js";
import {
  HEADER_BANNER, SL_FRAME,
  FS_TREE, fsGet, fsResolve
} from "./data.js";
import "./portfolio-terminal.css";

/* ─── intro script ─────────────────────────────────────────────────── */
function buildIntroScript() {
  return [
    { kind: "cmd", text: 'npx oh-my-logo@latest "Priyan\\nArora" fire --filled', cwdLabel: "~" },
    { kind: "logo", palette: "fire", delay: 1100 },
    { kind: "blank" },
    { kind: "muted", text: "  // Welcome, kind ser." },
    { kind: "muted", text: "  // type `help` to see what works. try `sl` for some fun." },
    { kind: "blank" }
  ];
}

/* ─── path helpers ─────────────────────────────────────────────────── */
function joinPath(cwd) { return cwd.length === 1 ? "~" : cwd.join("/"); }
function pathLabel(cwd) {
  if (cwd.length === 1) return "~";
  return "~/" + cwd.slice(1).join("/");
}

/* ─── command implementations ─────────────────────────────────────── */
function runLs(state, args) {
  const target = args[0] ? fsResolve(state.cwd, args[0]) : joinPath(state.cwd);
  const node = fsGet(target);
  if (!node) return [{ kind: "err", text: `ls: ${args[0] || target}: No such file or directory` }];
  if (node.type === "file") return [{ kind: "out", text: target.split("/").pop() }];
  const items = node.children.map((name) => {
    const child = fsGet(target + "/" + name);
    return { name, type: child ? child.type : "file" };
  });
  return [{ kind: "out", text: <LsRow items={items} /> }];
}

function LsRow({ items }) {
  return (
    <span className="pt-ls-row">
      {items.map((it, i) => (
        <span key={i} className={it.type === "dir" ? "pt-ls-dir" : "pt-ls-file"}>
          {it.name}{it.type === "dir" ? "/" : ""}
        </span>
      ))}
    </span>
  );
}

function runCd(state, args) {
  if (!args[0] || args[0] === "~") return { cwd: ["~"], output: [] };
  const target = fsResolve(state.cwd, args[0]);
  const node = fsGet(target);
  if (!node) return { output: [{ kind: "err", text: `cd: no such file or directory: ${args[0]}` }] };
  if (node.type !== "dir") return { output: [{ kind: "err", text: `cd: not a directory: ${args[0]}` }] };
  return { cwd: target.split("/"), output: [] };
}

function runCat(state, args) {
  if (!args[0]) return [{ kind: "err", text: "cat: missing file operand" }];
  const target = fsResolve(state.cwd, args[0]);
  const node = fsGet(target);
  if (!node) return [{ kind: "err", text: `cat: ${args[0]}: No such file or directory` }];
  if (node.type === "dir") return [{ kind: "err", text: `cat: ${args[0]}: Is a directory` }];
  return [{ kind: "raw", text: node.content }];
}

function runPwd(state) {
  return [{
    kind: "out",
    text: "/Users/priyan" + (state.cwd.length > 1 ? "/" + state.cwd.slice(1).join("/") : "")
  }];
}
function runWhoami() { return [{ kind: "out", text: "priyan" }]; }

function runHelp() {
  const rows = [
    ["ls [dir]",   "list files in current (or given) directory"],
    ["cd <dir>",   "change directory  ( ~  / .. / work )"],
    ["cat <file>", "print a file to stdout"],
    ["vim <file>", "open a file in a tiny vim viewer  (:q to quit)"],
    ["pwd",        "print working directory"],
    ["whoami",     "print current user"],
    ["clear",      "clear the screen"],
    ["sl",         "fun cmd — steam locomotive"],
    ["help",       "you're looking at it"]
  ];
  return [
    { kind: "muted", text: "Available commands:" },
    ...rows.map(([c, d]) => ({ kind: "raw", text: `  ${c.padEnd(15, " ")}  ${d}` })),
    { kind: "blank" },
    { kind: "muted", text: "Tip: start with  `cd work && ls`  to see my projects, or `cat cv.md`." }
  ];
}

function runVim(state, args) {
  if (!args[0]) return { output: [{ kind: "err", text: "vim: missing file operand" }] };
  const target = fsResolve(state.cwd, args[0]);
  const node = fsGet(target);
  if (!node) return { output: [{ kind: "err", text: `vim: ${args[0]}: cannot open file` }] };
  if (node.type === "dir") return { output: [{ kind: "err", text: `vim: ${args[0]}: is a directory` }] };
  return {
    output: [],
    vim: { filename: target.replace(/^~\//, "").replace(/^~$/, "home"), content: node.content }
  };
}

function runTree(state, args) {
  const root = args[0] ? fsResolve(state.cwd, args[0]) : joinPath(state.cwd);
  const node = fsGet(root);
  if (!node) return [{ kind: "err", text: `tree: ${args[0] || root}: No such file or directory` }];
  const out = [root === "~" ? "~" : root.replace(/^~\//, "")];
  function walk(path, prefix) {
    const n = fsGet(path);
    if (!n || n.type !== "dir") return;
    n.children.forEach((c, i) => {
      const last = i === n.children.length - 1;
      const branch = last ? "└── " : "├── ";
      const child = fsGet(path + "/" + c);
      out.push(prefix + branch + c + (child && child.type === "dir" ? "/" : ""));
      if (child && child.type === "dir") walk(path + "/" + c, prefix + (last ? "    " : "│   "));
    });
  }
  walk(root, "");
  return [{ kind: "raw", text: out.join("\n") }];
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/* ─── HeaderBanner / FooterHint / VisualToggle ────────────────────── */
function HeaderBanner() {
  return <pre className="pt-header-banner">{HEADER_BANNER.join("\n")}</pre>;
}

function FooterHint() {
  return (
    <div className="pt-footer-hint">
      <span>↑↓ history</span>
      <span>ctrl + L clear</span>
      <span>click anywhere on the terminal to focus</span>
    </div>
  );
}

function VisualToggleButton() {
  function onClick(e) {
    e.currentTarget.classList.add("is-pressed");
    setTimeout(() => {
      const el = document.querySelector(".pt-visual-toggle");
      el && el.classList.remove("is-pressed");
      window.location.assign("/");
    }, 180);
  }
  return (
    <button
      type="button"
      className="pt-visual-toggle"
      onClick={onClick}
      aria-label="Switch to Visual"
    >
<pre className="pt-visual-toggle-art">{`┌───────────────────────┐
│   Switch to Visual?   │
└──────[ press ⏎ ]──────┘`}</pre>
    </button>
  );
}

/* ─── main component ──────────────────────────────────────────────── */
export default function PortfolioTerminal({ alwaysShowTweaks = false } = {}) {
  // tweaks (palette + bg locked — "fire" on #1d0d2e)
  const tweakDefaults = {
    palette: "fire",
    typingSpeed: 28,
    showHeader: true,
    bg: "#1d0d2e"
  };
  const [t, setTweak] = useTweaks(tweakDefaults);

  // shell state
  const [lines, setLines] = useState([]);
  const [input, setInput] = useState("");
  const [cwd, setCwd] = useState(["~"]);
  const [accepting, setAccepting] = useState(false);
  const [booted, setBooted] = useState(false);
  const [vim, setVim] = useState(null);
  const [sl, setSl] = useState(null);
  const [history, setHistory] = useState([]);
  const [histIdx, setHistIdx] = useState(-1);
  const keyAudio = useKeyboardAudio(true);

  // boot sequence
  useEffect(() => {
    if (booted) return;
    let cancelled = false;
    const script = buildIntroScript();
    const speed = Math.max(4, t.typingSpeed);

    async function play() {
      const first = script[0];
      let buf = "";
      setLines([{ kind: "cmd", text: "", cwdLabel: first.cwdLabel }]);
      for (const ch of first.text) {
        if (cancelled) return;
        keyAudio.down(ch);
        buf += ch;
        setLines([{ kind: "cmd", text: buf, cwdLabel: first.cwdLabel }]);
        setTimeout(() => keyAudio.up(ch), 80);
        await sleep(speed);
      }
      keyAudio.down("Enter");
      setTimeout(() => keyAudio.up("Enter"), 80);
      await sleep(350);
      for (let i = 1; i < script.length; i++) {
        if (cancelled) return;
        const item = script[i];
        setLines((prev) => [...prev, item]);
        await sleep(item.delay || 80);
      }
      if (!cancelled) { setAccepting(true); setBooted(true); }
    }
    play();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // sl animation loop (vim-style takeover)
  useEffect(() => {
    if (!sl) return;
    const trainW = SL_FRAME[0].length;
    if (sl.pos < -trainW) {
      const id = setTimeout(() => setSl(null), 400);
      return () => clearTimeout(id);
    }
    const id = setTimeout(
      () => setSl((s) => (s ? { pos: s.pos - 6, phase: s.phase + 1 } : null)),
      110
    );
    return () => clearTimeout(id);
  }, [sl]);

  // input helpers
  function pushOutput(arr) { setLines((prev) => [...prev, ...arr]); }

  function submit() {
    const raw = input;
    setInput("");
    const trimmed = raw.trim();
    setLines((prev) => [...prev, { kind: "cmd", text: raw, cwdLabel: pathLabel(cwd) }]);
    if (!trimmed) return;
    setHistory((h) => [...h, trimmed]);
    setHistIdx(-1);

    const parts = trimmed.split(/\s+/);
    const cmd = parts[0];
    const args = parts.slice(1);

    if (cmd === "clear") { setLines([]); return; }
    if (cmd === "ls")    { pushOutput(runLs({ cwd }, args)); return; }
    if (cmd === "pwd")   { pushOutput(runPwd({ cwd })); return; }
    if (cmd === "whoami"){ pushOutput(runWhoami()); return; }
    if (cmd === "help")  { pushOutput(runHelp()); return; }
    if (cmd === "cat")   { pushOutput(runCat({ cwd }, args)); return; }
    if (cmd === "echo")  { pushOutput([{ kind: "out", text: args.join(" ") }]); return; }
    if (cmd === "exit")  { pushOutput([{ kind: "muted", text: "There's no escape. Type `help` instead." }]); return; }
    if (cmd === "tree")  { pushOutput(runTree({ cwd }, args)); return; }
    if (cmd === "man")   { pushOutput([{ kind: "muted", text: `No manual entry for ${args[0] || "that"}. Try \`help\`.` }]); return; }

    if (cmd === "cd") {
      const r = runCd({ cwd }, args);
      if (r.cwd) setCwd(r.cwd);
      if (r.output && r.output.length) pushOutput(r.output);
      return;
    }
    if (cmd === "vim" || cmd === "vi") {
      const r = runVim({ cwd }, args);
      if (r.output && r.output.length) pushOutput(r.output);
      if (r.vim) setVim(r.vim);
      return;
    }
    if (cmd === "sl") {
      setSl({ pos: 100, phase: 0 });
      return;
    }

    pushOutput([{ kind: "err", text: `zsh: command not found: ${cmd}` }]);
  }

  // global key handling — history nav + ctrl+L / ctrl+C
  useEffect(() => {
    function onKey(e) {
      if (vim) return;
      if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        if (history.length === 0) return;
        e.preventDefault();
        let idx = histIdx;
        if (e.key === "ArrowUp") idx = idx < 0 ? history.length - 1 : Math.max(0, idx - 1);
        else                     idx = idx < 0 ? -1 : Math.min(history.length, idx + 1);
        setHistIdx(idx);
        setInput(idx >= 0 && idx < history.length ? history[idx] : "");
      }
      if (e.ctrlKey && e.key.toLowerCase() === "l") {
        e.preventDefault(); setLines([]);
      }
      if (e.ctrlKey && e.key.toLowerCase() === "c") {
        e.preventDefault();
        setLines((prev) => [...prev, { kind: "cmd", text: input + "^C", cwdLabel: pathLabel(cwd) }]);
        setInput("");
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [history, histIdx, input, cwd, vim]);

  return (
    <div className="pt-stage" style={{ background: t.bg }}>
      <div className="pt-terminal-wrap">
        <div className="pt-terminal-row">
          <div className="pt-terminal-col">
            {t.showHeader && <HeaderBanner />}
            <Terminal
              title="priyan@portfolio — bash"
              lines={lines.map((l) => l.kind === "logo" ? { ...l, palette: t.palette } : l)}
              inputValue={input}
              onChange={setInput}
              onSubmit={submit}
              cwdLabel={pathLabel(cwd)}
              accepting={accepting && !vim && !sl}
              vimMode={vim}
              slMode={sl}
              onVimQuit={() => setVim(null)}
              enableSound={true}
            />
            <FooterHint />
          </div>
          <VisualToggleButton />
        </div>
      </div>
      <TweaksUI t={t} setTweak={setTweak} alwaysShow={alwaysShowTweaks} />
    </div>
  );
}
