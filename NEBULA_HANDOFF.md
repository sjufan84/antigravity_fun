# Nebula: Handoff Instructions

## The Concept
**Nebula** is a 3D visualization of thoughts. Instead of lists, we use stars.
The goal is to build a "Digital Garden" that feels like a living galaxy.

## Current State (v0.3 "Make it Remember")
- **Framework:** Next.js 16, TypeScript, Tailwind.
- **3D Engine:** React Three Fiber (R3F) + Drei.
- **State:** Zustand store (`useGalaxyStore.ts`).
- **Database:** Prisma 7 + SQLite with `@prisma/adapter-better-sqlite3`.
- **AI:** Google Gemini (`gemini-embedding-001`) via Vercel AI SDK.
- **Components:**
    - `GalaxyScene.tsx`: The infinite void. Starts zoomed out (Z=22). OrbitControls enabled for manual navigation.
    - `CameraController.tsx`: Handles smooth focus and reset animations.
    - `ConstellationLines.tsx`: Connects stars based on semantic similarity (Threshold 0.5).
    - `SearchBar.tsx`: Semantic search with auto-focus.
    - `actions.ts`: Server actions for DB operations (create/get/search).
    - `lib/prisma.ts`: Prisma Client configured with better-sqlite3 adapter.

## The Mission (Next Steps)
You are Player 4. The universe is connected and alive.

### 1. Persistence (The Database)
- **Status:** **[DONE]**
- **Implementation:**
    - **Prisma 7** with **SQLite** (`dev.db`) using **`@prisma/adapter-better-sqlite3`**.
    - Schema uses `prisma-client-js` generator with `engineType = "library"`.
    - `Star` model stores `x, y, z`, `content`, `color`, and `embedding` (as JSON string).
    - `useGalaxyStore` loads stars on mount via `getStars()` action.
    - **Important:** `lib/prisma.ts` instantiates adapter before PrismaClient.

### 2. Search & Travel
- **Status:** **[DONE]**
- **Implementation:**
    - `SearchBar` component added to top-right.
    - Server Action `searchStars` performs in-memory cosine similarity on embeddings.
    - Selecting a result (or top match) triggers `setActiveStar` which flies the camera.

### 3. Refinement
- **Status:** **[TODO]**
- **Goal:** Polish the experience.
- **Ideas:**
    - **Camera:** Experiment with `reset` logic in `CameraController` (currently damps to center).
    - **Visuals:** Add bloom or particles for "Ignition".

Good luck, Space Cowboy. 🚀
