/* ─────────────────────────────────────────────────────────────────────
   PortfolioTerminal — data module
   Virtual filesystem, ASCII art, color palettes.
   Pure ES module — no DOM, no React.
   ───────────────────────────────────────────────────────────────────── */

/* ─── ASCII logo (ANSI Shadow) ─────────────────────────────────────── */
const _PRIYAN = [
  "██████╗ ██████╗ ██╗██╗   ██╗ █████╗ ███╗   ██╗",
  "██╔══██╗██╔══██╗██║╚██╗ ██╔╝██╔══██╗████╗  ██║",
  "██████╔╝██████╔╝██║ ╚████╔╝ ███████║██╔██╗ ██║",
  "██╔═══╝ ██╔══██╗██║  ╚██╔╝  ██╔══██║██║╚██╗██║",
  "██║     ██║  ██║██║   ██║   ██║  ██║██║ ╚████║",
  "╚═╝     ╚═╝  ╚═╝╚═╝   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═══╝"
];
const _ARORA = [
  " █████╗ ██████╗  ██████╗ ██████╗  █████╗ ",
  "██╔══██╗██╔══██╗██╔═══██╗██╔══██╗██╔══██╗",
  "███████║██████╔╝██║   ██║██████╔╝███████║",
  "██╔══██║██╔══██╗██║   ██║██╔══██╗██╔══██║",
  "██║  ██║██║  ██║╚██████╔╝██║  ██║██║  ██║",
  "╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝"
];
export const LOGO_LINES = [..._PRIYAN, ..._ARORA];

/* ─── palettes ─────────────────────────────────────────────────────── */
export const PALETTES = {
  fire:   ["#ff0000", "#ff4500", "#ff7f00", "#ffa500", "#ffd700", "#ffff00"],
  sunset: ["#ff5e62", "#ff9966", "#ffb86b", "#ffd28d", "#ffe9b3", "#fff4d6"],
  matrix: ["#003b00", "#008f11", "#00bb1f", "#00ff41", "#39ff14", "#aaffaa"],
  ocean:  ["#0b1d51", "#1a3e8a", "#2a6fdb", "#3aa9ff", "#7ed6ff", "#d6f0ff"],
  nebula: ["#3b0d5b", "#6a1b9a", "#9c27b0", "#e040fb", "#ff77ff", "#ffd9ff"],
  gold:   ["#5b3a00", "#8a5a00", "#c98600", "#f5b400", "#ffd24a", "#fff2a8"],
  mono:   ["#cccccc", "#bdbdbd", "#ababab", "#9a9a9a", "#888888", "#777777"]
};

/* ─── SL locomotive ────────────────────────────────────────────────── */
export const SL_FRAME = [
  "      ====        ________                ___________ ",
  "  _D _|  |_______/        \\__I_I_____===__|_________| ",
  "   |(_)---  |   H\\________/ |   |        =|___ ___|   ",
  "   /     |  |   H  |  |     |   |         ||_| |_||   ",
  "  |      |  |   H  |__--------------------| [___] |   ",
  "  | ________|___H__/__|_____/[][]~\\_______|       |   ",
  "  |/ |   |-----------I_____I [][] []  D   |=======|__ "
];
export const SL_WHEELS = [
  "__/ =| o |=-~~\\  /~~\\  /~~\\  /~~\\ ____Y___________|__",
  " |/-=|___|=    ||    ||    ||    |_____/~\\___/        ",
  "  \\_/      \\O=====O=====O=====O_/      \\_/            "
];

/* ─── header banner ────────────────────────────────────────────────── */
export const HEADER_BANNER = [
  "# ─────────────────────────────────────────────────────────────────────",
  "#  type `help` to list commands",
  "# ─────────────────────────────────────────────────────────────────────",
  "#   ls            list files in the current directory",
  "#   cd <dir>      change directory  (work / .. / ~)",
  "#   cat <file>    print file to stdout  (try cv.md / contact.md)",
  "#   vim <file>    open file in a basic vim viewer  (:q to quit)",
  "#   pwd           print working directory",
  "#   whoami        print current user",
  "#   clear         clear the screen",
  "#   sl            fun cmd: steam locomotive",
  "#   help          show this list anytime",
  "# ─────────────────────────────────────────────────────────────────────"
];

/* ─── virtual filesystem ───────────────────────────────────────────── */
export const FS_TREE = {
  "~": {
    type: "dir",
    children: ["work", "cv.md", "contact.md", "README.md"]
  },

  "~/README.md": {
    type: "file",
    content:
`Hi, I'm Priyan.

You're standing in my home directory. One folder, three files.

  work/         ← my projects (run \`cd work && ls\`)
  cv.md         ← who I am, skills, education
  contact.md    ← where to find me

Try \`vim work/01_PRPilot\` to read a project. Or \`sl\` if you're bored.
`
  },

  // ───────────── work/ ─────────────
  "~/work": {
    type: "dir",
    children: [
      "01_PRPilot",
      "02_Auctus",
      "03_D3Careers",
      "04_BSI_Solutionz",
      "05_EVLOS-OPS",
      "06_Likit",
      "07_Event_Mgmt"
    ]
  },

  "~/work/01_PRPilot": {
    type: "file",
    tag: "[ TypeScript · AWS Lambda · GitHub App ]",
    content:
`PRPilot
=======

A self-hosted GitHub App that checks pull requests before a human
reviewer spends time on them. Fast, rule-based feedback published
right back into the PR as a GitHub Check Run.

The "fast lane"
---------------
The main review path is the fast lane. It is designed to be the
required check in the normal PR flow. It looks at:

    - changed files
    - workflow files
    - package files
    - lockfile changes
    - risky patterns

If it can review the PR honestly, it reports success / warning /
failure. If it cannot complete a full review, it says so clearly
instead of pretending everything passed.

Self-hosted by design
---------------------
The deployment owner runs the GitHub App in their own AWS account
and controls the selected repositories, runtime policy, logs,
storage, and cost limits — suitable for private repos where code
should never leave for a third-party AI service.

Stack
-----
TypeScript · Node.js · AWS Lambda · API Gateway · SQS · DynamoDB ·
Parameter Store · Octokit · Zod · Vitest.

Includes webhook signature verification, selected-repo checks,
delivery deduplication, safe queue handoff, short-lived metadata
storage, and clear GitHub Check Run output.
`
  },

  "~/work/02_Auctus": {
    type: "file",
    tag: "[ Next.js · Supabase · Funding discovery ]",
    content:
`Auctus
======

A Canadian funding discovery platform that helps people find
opportunities that match who they are and what they need.

Three audiences, three flows
----------------------------
    businesses → grants and support programs
    students   → scholarships and bursaries
    professors → research funding

Each role gets pages and filters built for its needs instead of
forcing every user through one generic search.

What it includes
----------------
    - Supabase authentication
    - profile onboarding
    - saved funding preferences
    - profile-based match scoring
    - funding detail pages with official application links
    - a dashboard (recommendations, deadlines, profile, forum)

Community forum
---------------
Threads, replies, and upvotes on helpful answers. A scraper
package ingests official Canadian funding sources.

The database lives behind Supabase migrations — profiles,
role-specific tables, funding records, preferences, forum data,
scrape metadata, row-level security, and tag backfills for
better matching.
`
  },

  "~/work/03_D3Careers": {
    type: "file",
    tag: "[ React · D3 Sankey · MongoDB ]",
    content:
`D3Careers
=========

A full-stack career exploration app that helps students understand
how people move from majors into first jobs and later roles.

The hero is a D3 Sankey diagram of career movement. Filter by major
and background, browse alumni profiles, and use the app as a
starting point for mentor chats.

Public vs protected
-------------------
Public pages work without login:
    - career pathway page
    - career map
    - alumni cards
    - alumni profile pages

Login gates only the protected stuff: dashboards, profile
completion, booking-related actions.

Stack
-----
React · Vite · Node.js · Express · MongoDB · JWT · Cal.com

Data started from a real Kaggle careers dataset, cleaned and
reshaped into believable career paths with major weights and
background tags. The backend turns alumni timelines into nodes
and links — the frontend renders the visual career map.

Also includes protected routes, role-based flows, password
hashing, rate limiting, input validation, CORS setup, ID checks,
and backend tests.
`
  },

  "~/work/04_BSI_Solutionz": {
    type: "file",
    tag: "[ Astro · React islands · Tailwind ]",
    content:
`BSI Solutionz
=============

A public business website for a hoist, crane, generator, and
material-handling dealer. The goal: make it dead simple for
visitors to understand what BSI offers and contact the business
without friction.

Why Astro
---------
Most pages are content-focused. Astro keeps the site fast and
avoids shipping a full app when most pages only need static HTML.
React is used only where interaction is needed — mainly the
enquiry UI. Tailwind handles styling.

The enquiry flow
----------------
    visitor fills form
        │
        ▼
    Zod + React Hook Form  (client-side validation)
        │
        ▼
    Astro API route        (validates, cleans, never trusts client)
        │
        ▼
    Resend                 (server-side secret — never exposed)

Product discovery, clear enquiry capture, fast loading pages,
easy hosting. No more, no less.
`
  },

  "~/work/05_EVLOS-OPS": {
    type: "file",
    tag: "[ ArcGIS · Python · GIS planning ]",
    content:
`EVLOS-OPS
=========

An educational GIS decision-support prototype for EVLOS-style
drone corridor planning in Fredericton, New Brunswick.

It maps possible drone pilot staging points and visual observer
positions using terrain visibility, coverage gaps, scoring rules,
and Python exports.

What it is NOT
--------------
    ✗ flight approval
    ✗ a substitute for legal review
    ✗ live airspace monitoring
    ✗ a complete aviation safety system

It shows how GIS can support planning by identifying where
visibility may be strong, weak, or missing.

The workflow
------------
    1. Prepare open spatial data in ArcGIS Pro (city boundary,
       roads, trails, hydro, buildings, parks, corridors, DEM)
    2. Generate planning corridors + target points along them
    3. Generate candidate observer points from trails/parks/roads
    4. Build observer↔target pairs with distance limits + sector logic
    5. Run line-of-sight on a bare-earth DEM

Coverage classes
----------------
    blind   no visible observer
    weak    one visible observer
    strong  two or more

Pilot/staging candidates are scored on observer support, nearby
coverage, access context, distance to the corridor, and general
suitability. A Python script then ranks nearby candidates and
exports cleaned JSON + GeoJSON for downstream software.
`
  },

  "~/work/06_Likit": {
    type: "file",
    tag: "[ Workflow kit · AI as mentor ]",
    content:
`Likit
=====

A lightweight workflow kit that helps students build software
projects with AI as a *mentor*, not a code writer.

Designed for tools like Claude Code and Codex — but the point is
NOT to let AI write the project for you.

The setup
---------
Before implementation starts, Likit runs a structured questionnaire:
    - project idea
    - skill level
    - tech stack
    - features
    - architecture
    - constraints

Then it critiques the answers, finds gaps, and turns the idea into
a clearer build plan.

Gates
-----
The project is built around gates — checkpoints that must pass
before moving forward. Each gate has proof requirements: command
output, test results, working demos, or clear explanations. You
cannot skip the hard parts or say "it's done" without evidence.

    Gate 0       setup questionnaire → planning files
    Gate 1..17   build phases, each focused on one piece

Progress is tracked across sessions so you can return in a new
chat and continue without losing context.

Professional habits enforced
----------------------------
walking skeleton first · vertical slices · clear commits ·
test core logic · keep functions and names clean · avoid
unnecessary features · document important decisions · debug
with method · end sessions with small working progress.
`
  },

  "~/work/07_Event_Mgmt": {
    type: "file",
    tag: "[ Java · Microservices · WIP ]",
    content:
`Event Management Platform
=========================

An in-progress Java microservice project for publishing events and
reserving seats *safely*. The focus: service boundaries, auth,
gateway routing, database migrations, and capacity-safe
registration.

Services
--------
    event         event records + lifecycle
    identity      register, login, /me, password hashing, JWT
    gateway       JWT validation, role guards, proxy + header forwarding
    registration  reservation APIs, capacity-safe reserves,
                  cancellation, PostgreSQL storage, outbox rows

Current state
-------------
Work through Phase 10. Event, identity, gateway, and registration
services are in place with tests and migrations across the board.
The registration service uses Testcontainers for PostgreSQL-backed
integration testing. Flyway keeps DB changes versioned and
repeatable.

Also living in the repo
-----------------------
    - draft OpenAPI and AsyncAPI contracts
    - Docker Compose for shared local infra
      (PostgreSQL, RabbitMQ, MailHog)

Planned in later gated phases:
    RabbitMQ publishing · React web client · Kubernetes manifests · CI
`
  },

  // ───────────── cv.md ─────────────
  "~/cv.md": {
    type: "file",
    content:
`CV
==

Elevator Pitch
--------------
I am a Computer Science student who enjoys learning and building
practical software projects. I like going outside my comfort zone
and picking up whatever the problem needs, whether that is a new
framework, a new tool, or a language I have not used before.

I am open to new opportunities, collaborations, and professional
connections.

Tech Stack
----------
Languages
    JavaScript · TypeScript · Java · C · SQL

Frontend
    React · Next.js · Astro · D3.js · Tailwind CSS · GSAP ·
    HTML · CSS

Backend
    Node.js · Express · Spring Boot · REST APIs · gRPC ·
    JWT authentication · Zod

Databases
    MongoDB · DynamoDB · MySQL · Supabase · PostgreSQL

Cloud and Tools
    AWS Lambda · API Gateway · SQS · Parameter Store · S3 ·
    CloudFront · Docker · GitHub Actions · Vercel · Render ·
    Cloudflare · Git · Maven · npm workspaces · Vitest · Jest ·
    Supertest · Flyway

Education
---------
Bachelor of Computer Science
University of New Brunswick
September 2024 — May 2028

    2024/25 Assessment Year GPA   3.6 / 4.3
    2025/26 Assessment Year GPA   4.0 / 4.3
    2026 Summer GPA               4.0 / 4.3
    CGPA                          3.9 / 4.3

Awards
------
    Dean's List                                  2025 — 2026
    UNB Scholarship for Academic Excellence      2024 — 2025

Certifications
--------------
    IBM JavaScript Programming with React, Node
        and MongoDB Specialization               January 2026

    IBM Java Developer Professional Certificate  January 2026

    IBM Introduction to DevOps                   October 2025
`
  },

  // ───────────── contact.md ─────────────
  "~/contact.md": {
    type: "file",
    content:
`Contact
=======

LinkedIn
    www.linkedin.com/in/priyanarora

GitHub
    https://github.com/PriyanArora

Email
    priyan.arora@unb.ca
`
  }
};

/* ─── path helpers ─────────────────────────────────────────────────── */
export function fsResolve(cwd, target) {
  if (!target || target === "." || target === "./") return cwd.join("/");
  if (target === "~" || target === "/" || target === "/~") return "~";
  let parts;
  if (target.startsWith("~/") || target === "~") {
    parts = target.split("/").filter(Boolean);
  } else if (target.startsWith("/")) {
    parts = ["~"].concat(target.split("/").filter(Boolean));
  } else {
    parts = cwd.slice();
    for (const seg of target.split("/").filter(Boolean)) {
      if (seg === ".") continue;
      if (seg === "..") { if (parts.length > 1) parts.pop(); continue; }
      parts.push(seg);
    }
  }
  return parts.join("/");
}

export function fsGet(path) {
  return FS_TREE[path] || null;
}
