/* ─────────────────────────────────────────────────────────────────────
   PortfolioTerminal — Terminal chrome
   - bash syntax highlighting
   - line renderers
   - vim viewer
   - sl steam-locomotive stage (vim-style takeover)
   ───────────────────────────────────────────────────────────────────── */

import React, { useEffect, useRef, useState } from "react";
import { PALETTES, LOGO_LINES, SL_FRAME, SL_WHEELS } from "./data.js";
import { useKeyboardAudio } from "./keySounds.js";

/* ─── bash syntax highlighting ────────────────────────────────────── */
const BASH_TOKENS = {
  commands: new Set([
    "npx", "npm", "yarn", "pnpm",
    "ls", "cd", "cat", "vim", "vi", "pwd", "echo", "clear", "help",
    "whoami", "sl", "exit", "tree", "man", "git"
  ]),
  subcommands: new Set([
    "install", "init", "add", "run", "build", "start", "dev", "test"
  ])
};

function bashHighlight(line) {
  const out = [];
  const re = /(\s+)|("(?:[^"\\]|\\.)*")|('(?:[^'\\]|\\.)*')|(--?[A-Za-z0-9][-\w]*)|(\S+)/g;
  let m, firstWord = true, prevWasRunner = false;
  while ((m = re.exec(line)) !== null) {
    const [, ws, dq, sq, flag, word] = m;
    if (ws) { out.push({ t: ws }); continue; }
    if (dq) { out.push({ t: dq, c: "pt-tk-str" }); firstWord = false; prevWasRunner = false; continue; }
    if (sq) { out.push({ t: sq, c: "pt-tk-str" }); firstWord = false; prevWasRunner = false; continue; }
    if (flag) { out.push({ t: flag, c: "pt-tk-flag" }); firstWord = false; prevWasRunner = false; continue; }
    if (word) {
      if (word.includes("/") || word.startsWith("./") || word.startsWith("~")) {
        out.push({ t: word, c: "pt-tk-path" });
      } else if (firstWord && BASH_TOKENS.commands.has(word)) {
        out.push({ t: word, c: "pt-tk-cmd" });
        if (["npx","npm","yarn","pnpm","git"].includes(word)) prevWasRunner = true;
      } else if (prevWasRunner && BASH_TOKENS.subcommands.has(word)) {
        out.push({ t: word, c: "pt-tk-sub" });
        prevWasRunner = false;
      } else if (prevWasRunner && /^[a-z][\w-]*@(latest|next|[\d.]+)$/i.test(word)) {
        out.push({ t: word, c: "pt-tk-pkg" });
      } else if (/^\d+(\.\d+)?[a-z]*$/i.test(word)) {
        out.push({ t: word, c: "pt-tk-num" });
      } else {
        out.push({ t: word });
        prevWasRunner = false;
      }
      firstWord = false;
    }
  }
  return out;
}

function HighlightedLine({ text }) {
  const tokens = bashHighlight(text);
  return (
    <span>
      {tokens.map((tk, i) =>
        tk.c ? <span key={i} className={tk.c}>{tk.t}</span> : <span key={i}>{tk.t}</span>
      )}
    </span>
  );
}

/* ─── prompt ──────────────────────────────────────────────────────── */
function PromptPrefix({ user = "priyan", host = "portfolio", cwdLabel = "~" }) {
  return (
    <span className="pt-prompt">
      <span className="pt-prompt-user">{user}@{host}</span>
      <span className="pt-prompt-colon">:</span>
      <span className="pt-prompt-path">{cwdLabel}</span>
      <span className="pt-prompt-dollar">$</span>{" "}
    </span>
  );
}

/* ─── line renderers ──────────────────────────────────────────────── */
function renderLine(line, key) {
  switch (line.kind) {
    case "cmd":
      return (
        <div className="pt-line" key={key}>
          <PromptPrefix cwdLabel={line.cwdLabel} />
          <HighlightedLine text={line.text} />
        </div>
      );
    case "out":  return <div className="pt-line pt-out" key={key}>{line.text}</div>;
    case "err":  return <div className="pt-line pt-err" key={key}>{line.text}</div>;
    case "muted":return <div className="pt-line pt-muted" key={key}>{line.text}</div>;
    case "raw":  return <pre className="pt-pre" key={key}>{line.text}</pre>;
    case "logo": return <LogoBlock key={key} palette={line.palette} />;
    case "blank":return <div className="pt-line" key={key}>&nbsp;</div>;
    default:     return <div className="pt-line" key={key}>{line.text}</div>;
  }
}

/* ─── fire-gradient logo ──────────────────────────────────────────── */
function LogoBlock({ palette = "fire" }) {
  const colors = PALETTES[palette] || PALETTES.fire;
  const stops = colors.map((c, i) => `${c} ${(i / (colors.length - 1)) * 100}%`).join(", ");
  const grad = `linear-gradient(180deg, ${stops})`;
  return (
    <pre
      className="pt-logo"
      style={{
        backgroundImage: grad,
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        color: "transparent",
        WebkitTextFillColor: "transparent"
      }}
    >
      {LOGO_LINES.join("\n")}
    </pre>
  );
}

/* ─── sl stage (vim-style takeover) ───────────────────────────────── */
function SlStage({ pos, phase }) {
  const pad = Math.max(0, pos);
  const startCut = Math.max(0, -pos);
  const rows = SL_FRAME.map((row) => " ".repeat(pad) + row.slice(startCut));
  const wheelRow = SL_WHEELS[phase % SL_WHEELS.length];
  const text = rows.join("\n") + "\n" + " ".repeat(pad) + wheelRow.slice(startCut);
  return (
    <div className="pt-sl-stage">
      <pre className="pt-sl-train">{text}</pre>
    </div>
  );
}

/* ─── vim viewer ──────────────────────────────────────────────────── */
function VimViewer({ filename, content, onQuit, keyAudio }) {
  const [cmd, setCmd] = useState("");
  const [insertMode, setInsertMode] = useState(false);
  const [status, setStatus] = useState("");
  const inputRef = useRef(null);

  useEffect(() => { inputRef.current && inputRef.current.focus(); }, []);

  const lines = content.split("\n");

  function handleKey(e) {
    keyAudio.down(e.key);
    if (insertMode) {
      if (e.key === "Escape") { e.preventDefault(); setInsertMode(false); setStatus(""); }
      return;
    }
    if (e.key === ":") { e.preventDefault(); setCmd(":"); return; }
    if (e.key === "i") { e.preventDefault(); setInsertMode(true); setStatus("-- INSERT --"); return; }
    if (cmd.startsWith(":")) {
      if (e.key === "Enter") {
        e.preventDefault();
        const c = cmd.slice(1).trim();
        if (c === "q" || c === "q!" || c === "wq" || c === "x") { onQuit(); }
        else { setStatus(`E492: Not an editor command: ${c}`); setCmd(""); }
        return;
      }
      if (e.key === "Backspace") {
        e.preventDefault(); setCmd(cmd.length === 1 ? "" : cmd.slice(0, -1)); return;
      }
      if (e.key === "Escape") { e.preventDefault(); setCmd(""); return; }
      if (e.key.length === 1) { e.preventDefault(); setCmd(cmd + e.key); return; }
    }
  }

  return (
    <div
      className="pt-vim"
      tabIndex={0}
      onKeyDown={handleKey}
      onKeyUp={(e) => keyAudio.up(e.key)}
      onClick={() => inputRef.current && inputRef.current.focus()}
    >
      <input
        ref={inputRef}
        className="pt-vim-hidden-input"
        autoFocus
        onBlur={(e) => setTimeout(() => e.target.focus(), 0)}
      />
      <div className="pt-vim-buffer">
        {lines.map((ln, i) => (
          <div className="pt-vim-line" key={i}>
            <span className="pt-vim-gutter">{String(i + 1).padStart(3, " ")}</span>
            <span className="pt-vim-text">{ln || "\u00A0"}</span>
          </div>
        ))}
        {Array.from({ length: Math.max(0, 22 - lines.length) }).map((_, i) => (
          <div className="pt-vim-line pt-vim-empty" key={`tilde-${i}`}>
            <span className="pt-vim-gutter">~</span>
          </div>
        ))}
      </div>
      <div className="pt-vim-status">
        <span className="pt-vim-status-file">"{filename}"</span>
        <span className="pt-vim-status-meta"> {lines.length}L, {content.length}B</span>
        <span className="pt-vim-status-mode">{status}</span>
        <span className="pt-vim-status-right">
          type <span className="pt-vim-key">:q</span> to quit
        </span>
      </div>
      <div className="pt-vim-cmdline">{cmd}<span className="pt-vim-cmd-cursor" /></div>
    </div>
  );
}

/* ─── Terminal shell ──────────────────────────────────────────────── */
export default function Terminal({
  title = "priyan@portfolio — bash",
  lines,
  inputValue,
  onChange,
  onSubmit,
  prompt = { user: "priyan", host: "portfolio" },
  cwdLabel = "~",
  accepting = true,
  vimMode = null,
  slMode = null,
  onVimQuit,
  enableSound = true
}) {
  const scrollRef = useRef(null);
  const inputRef = useRef(null);
  const keyAudio = useKeyboardAudio(enableSound);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines, vimMode, slMode]);

  function focusInput() {
    keyAudio.prime();
    if (inputRef.current && !vimMode && !slMode) inputRef.current.focus();
  }
  useEffect(() => { focusInput(); }, [accepting, vimMode, slMode]);

  return (
    <div className="pt-terminal" onClick={focusInput}>
      <div className="pt-titlebar">
        <span className="pt-lights">
          <span className="pt-light pt-red" />
          <span className="pt-light pt-yellow" />
          <span className="pt-light pt-green" />
        </span>
        <span className="pt-title">
          {vimMode ? `VIM — ${vimMode.filename}` : slMode ? "sl — steam locomotive" : title}
        </span>
        <span className="pt-lights pt-lights-spacer" />
      </div>

      <div className="pt-body" ref={scrollRef}>
        {vimMode ? (
          <VimViewer
            filename={vimMode.filename}
            content={vimMode.content}
            onQuit={onVimQuit}
            keyAudio={keyAudio}
          />
        ) : slMode ? (
          <SlStage pos={slMode.pos} phase={slMode.phase} />
        ) : (
          <>
            {lines.map((ln, i) => renderLine(ln, i))}
            {accepting && (
              <div className="pt-line pt-inputline">
                <PromptPrefix cwdLabel={cwdLabel} user={prompt.user} host={prompt.host} />
                <span className="pt-inputwrap">
                  <input
                    ref={inputRef}
                    className="pt-input"
                    value={inputValue}
                    onChange={(e) => onChange(e.target.value)}
                    onKeyDown={(e) => {
                      keyAudio.down(e.key);
                      if (e.key === "Enter") { e.preventDefault(); onSubmit(); }
                    }}
                    onKeyUp={(e) => keyAudio.up(e.key)}
                    autoFocus
                    spellCheck={false}
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                  />
                </span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
