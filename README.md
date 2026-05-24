# Portfolio V2

A personal portfolio website built to show featured work, skills, contact details, and an interactive terminal version of the portfolio.

## Tech Stack

Astro, React, TypeScript, Tailwind CSS, GSAP, and static content/data files.

## Terminal UI

The `/terminal` page uses an Aceternity-inspired terminal UI, then adds portfolio-specific features like a boot animation, virtual filesystem, shell commands, command history, a tiny vim-style viewer, keyboard sounds, a tweaks panel, and the `sl` easter egg.

## GSAP

GSAP is used on the main portfolio page for the hero word reveal and header entrance animation, with `SplitText` handling the animated word split.

## Run Locally

```bash
npm install
npm run dev
```

## Deploy

For Cloudflare Pages:

- Build command: `npm run build`
- Output directory: `dist`
