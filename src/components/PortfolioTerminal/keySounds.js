import { useCallback, useEffect, useRef } from "react";

const SOUND_URL = `${(import.meta.env.BASE_URL || "/").replace(/\/$/, "")}/sounds/sound.ogg`;

const KEY_SOUNDS_DOWN = {
  A: [31542, 85],
  B: [40621, 107],
  C: [39632, 95],
  D: [32492, 85],
  E: [23317, 83],
  F: [32973, 87],
  G: [33453, 94],
  H: [33986, 93],
  I: [25795, 91],
  J: [34425, 88],
  K: [34932, 90],
  L: [35410, 95],
  M: [41610, 93],
  N: [41103, 90],
  O: [26309, 84],
  P: [26804, 83],
  Q: [22245, 95],
  R: [23817, 92],
  S: [32031, 88],
  T: [24297, 92],
  U: [25313, 95],
  V: [40136, 94],
  W: [22790, 89],
  X: [39148, 76],
  Y: [24811, 93],
  Z: [38694, 80],
  " ": [51541, 144],
  "-": [42594, 90],
  "@": [23317, 83],
  "/": [42594, 90],
  ".": [42594, 90],
  ":": [42594, 90],
  "0": [26309, 84],
  "1": [25313, 95],
  "2": [23317, 83],
  "3": [23817, 92],
  "4": [24297, 92],
  "5": [24811, 93],
  "6": [25313, 95],
  "7": [25795, 91],
  "8": [26309, 84],
  "9": [26804, 83],
  Enter: [19065, 110],
  Backspace: [19065, 110]
};

const KEY_SOUNDS_UP = {
  A: [31632, 80],
  B: [40736, 95],
  C: [39732, 85],
  D: [32577, 80],
  E: [23402, 80],
  F: [33063, 80],
  G: [33553, 85],
  H: [34081, 85],
  I: [25890, 85],
  J: [34515, 85],
  K: [35027, 85],
  L: [35510, 85],
  M: [41710, 85],
  N: [41198, 85],
  O: [26394, 80],
  P: [26889, 80],
  Q: [22345, 85],
  R: [23912, 85],
  S: [32121, 80],
  T: [24392, 85],
  U: [25413, 85],
  V: [40236, 85],
  W: [22880, 85],
  X: [39228, 70],
  Y: [24911, 85],
  Z: [38779, 75],
  " ": [51691, 130],
  "-": [42689, 85],
  "@": [23402, 80],
  "/": [42689, 85],
  ".": [42689, 85],
  ":": [42689, 85],
  "0": [26394, 80],
  "1": [25413, 85],
  "2": [23402, 80],
  "3": [23912, 85],
  "4": [24392, 85],
  "5": [24911, 85],
  "6": [25413, 85],
  "7": [25890, 85],
  "8": [26394, 80],
  "9": [26889, 80],
  Enter: [19180, 100],
  Backspace: [19180, 100]
};

function lookupSound(map, key) {
  return map[key.toUpperCase()] || map[key];
}

export function useKeyboardAudio(enabled = true) {
  const ctxRef = useRef(null);
  const bufferRef = useRef(null);
  const loadingRef = useRef(null);

  useEffect(() => {
    return () => {
      if (ctxRef.current) ctxRef.current.close();
    };
  }, []);

  const ensureReady = useCallback(async () => {
    if (!enabled || typeof window === "undefined") return false;
    if (!ctxRef.current) {
      const AudioContextClass = window.AudioContext || window["webkitAudioContext"];
      if (!AudioContextClass) return false;
      ctxRef.current = new AudioContextClass();
    }

    if (ctxRef.current.state === "suspended") {
      try {
        await ctxRef.current.resume();
      } catch {
        return false;
      }
    }

    if (bufferRef.current) return true;
    if (!loadingRef.current) {
      loadingRef.current = fetch(SOUND_URL)
        .then((res) => (res.ok ? res.arrayBuffer() : null))
        .then((bytes) => (bytes ? ctxRef.current.decodeAudioData(bytes) : null))
        .then((buffer) => {
          bufferRef.current = buffer;
          return buffer;
        })
        .catch(() => null);
    }

    return loadingRef.current.then((buffer) => Boolean(buffer));
  }, [enabled]);

  const play = useCallback(async (sound) => {
    if (!sound || !(await ensureReady()) || !ctxRef.current || !bufferRef.current) return;
    const src = ctxRef.current.createBufferSource();
    src.buffer = bufferRef.current;
    src.connect(ctxRef.current.destination);
    src.start(0, sound[0] / 1000, sound[1] / 1000);
  }, [ensureReady]);

  return {
    prime: ensureReady,
    down: useCallback((key) => play(lookupSound(KEY_SOUNDS_DOWN, key)), [play]),
    up: useCallback((key) => play(lookupSound(KEY_SOUNDS_UP, key)), [play])
  };
}
