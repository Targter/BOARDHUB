# 🚀 Full‑Stack Showcase Challenge

*Next.js · Tailwind CSS · MongoDB*

**Duration: 24 hours**

---

## ✅ Completed Tasks

| Feature | Status |
|---------|:------:|
| CRUD Operations (Board, List, Card) | ✅ |
| Drag & Drop Functionality | ✅ |
| Google OAuth Login | ✅ |
| Landing Page | ✅ |
| Credential-based Authentication | ✅ |

## 🚀 Quick Start

### Prerequisites
Create a `.env` file in the root directory with the following variables:

```env
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_nextauth_secret_key
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### Installation
```bash
npm install
npm run dev
```

---

## 1 · Project Brief – **BoardHub**

> **Goal:** ship the first usable slice of **BoardHub**, a lightweight Trello‑style tool where teams create **boards →
lists → cards**.
> Two viewpoints must shine:
>
> 1. **User interface**: what a non‑technical manager experiences.
> 2. **Engineering craft**: what a senior developer inspects in the repo.

### Starter Skeleton
A minimal non‑functional code skeleton is provided in the repo. feel free to reshape or replace anything.

## 2 · Mandated Scope

Your 8‑hour sprint **must deliver every task flagged*Required***.
Anything marked *Stretch* is optional and should only be attempted **after** the required set is rock‑solid.

### 2.1 · User‑Interface Track

| ID     | Title                                                         | Effort |    Status    |
|--------|---------------------------------------------------------------|:------:|:------------:|
| **U0** | Core CRUD: create/edit/delete boards, lists & cards           |   ★★   | **Required** |
| **U1** | Responsive board UI with drag-&-drop lists/cards (`@dnd-kit`) |  ★★★★  | **Required** |
| **U2** | Dark/Light theme toggle (system+ manual)                      |   ★    | **Required** |
| **U3** | Empty states & skeleton loaders                               |   ★    | **Required** |
| U4     | Landing page with animated hero & CTA                         |   ★★   |   Stretch    |
| U5     | Inline card editor with markdown preview                      |  ★★★   |   Stretch    |
| U6     | Real‑time presence avatars via WebSocket                      |   ★★   |   Stretch    |
| U7     | Keyboard‑shortcut cheat‑sheet (`?` overlay)                   |   ★    |   Stretch    |
| U8     | Accessibility pass (WCAGAA, focus, aria)                      |   ★★   |   Stretch    |
| U9     | Public read‑only board share link                             |   ★★   |   Stretch    |

### 2.2 · Engineering Track

| ID     | Title                                                   | Effort |    Status    |
|--------|---------------------------------------------------------|:------:|:------------:|
| **E0** | API routes & server actions for CRUD boards/lists/cards |   ★★   | **Required** |
| **E1** | Manual auth: signup/login, cookie session, CSRF token   |  ★★★★  | **Required** |
| **E2** | MongoDB schema & indexes: boards/lists/cards            |   ★★   | **Required** |
| **E3** | Global error boundary+ basic logging (own util)         |   ★    | **Required** |
| E4     | Role‑based access control (owner/editor/viewer)         |   ★★   |   Stretch    |
| E5     | Optimistic UI with server actions & cache tags          |   ★★   |   Stretch    |
| E6     | Edge‑runtime rate limiter for writes (no libs)          |   ★    |   Stretch    |
| E7     | Multi‑stage Dockerfile (<200MB final image)             |   ★    |   Stretch    |
| E8     | Server‑sent events stream for live board updates        |   ★★   |   Stretch    |
| E9     | Audit‑log collection (who changed what)                 |   ★    |   Stretch    |
| E10    | Bundle analysis & perf budget (CLS  <0.1, LCP < 2.5s)   |   ★    |   Stretch    |

### 2.3 · Time‑Box Guidance

* Finish all **Required** items first - they are the acceptance criteria.
* Use any remaining time for polish or *Stretch* goals that best showcase your strengths.

---

## 3 · Deliverables

1. **Git repository** with granular commits and an enabled pre‑commit hook set (lint + type‑check).
2. **README.md** (this file) updated to include:
    * a **check‑list table** marking each Required item as Done
    * short rationale for any Stretch items you attempted.
    * quick‑start commands (`npm i && npm run dev` or `docker compose up`) and a `.env.example`.

---

## 4 · Evaluation

| Area                     | Must‑Have Criteria                                 | Weight |
|--------------------------|----------------------------------------------------|-------:|
| **Required Features**    | Every Required item works as described             |    50% |
| **Code Quality**         | Architecture, security, performance, test coverage |    30% |
| **Developer Ergonomics** | Clear README, commit narrative, DX niceties        |    10% |
| **Polish**               | Stretch goals, UX refinements, visual detail       |    10% |

### Passing Bar

A submission that completes **all Required tasks** with no critical bugs passes. Stretch goals and extra polish
distinguish exceptional entries.

### Submission Deadline

Push your final commit within the 24-48hr window in zipped file (.zip) at heykunalsoude@gmail.com
