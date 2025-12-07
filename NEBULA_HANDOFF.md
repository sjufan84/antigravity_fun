# Nebula: Handoff Instructions

## The Concept
**Nebula** is a 3D visualization of thoughts. Instead of lists, we use stars.
The goal is to build a "Digital Garden" that feels like a living galaxy.

## Current State (v0.2 "Make it Real")
- **Framework:** Next.js 14, TypeScript, Tailwind.
- **3D Engine:** React Three Fiber (R3F) + Drei.
- **State:** Zustand store (`useGalaxyStore.ts`).
- **AI:** Google Gemini (`text-embedding-004`) via Vercel AI SDK.
- **Components:**
    - `GalaxyScene.tsx`: The infinite void. Starts zoomed out (Z=30).
    - `CameraController.tsx`: Handles smooth focus and reset animations.
    - `ConstellationLines.tsx`: Connects stars based on semantic similarity (Threshold 0.5).
    - `actions.ts`: Server actions for generating embeddings.

## The Mission (Next Steps)
You are Player 4. The universe is connected and alive.

### 1. Persistence (The Database)
- **Status:** **[TODO]**
- **Goal:** Don't let the universe die on refresh. Currently, stars are temporary (in-memory).
- **How:** Hook up a database (Postgres/Supabase/SQLite).
    - Save stars to DB on creation.
    - Load stars from DB on mount.
    - Store `embedding` as `vector` type if using pgvector.

### 2. Search & Travel
- **Status:** **[TODO]**
- **Goal:** Find thoughts instantly.
- **How:** Implement a Search Bar in the UI.
    - Input text -> Generate Embedding -> Find nearest neighbors (Cosine Similarity).
    - Fly camera to the best match.
    - Note: You already have `generateEmbedding` in `actions.ts`.

### 3. Refinement
- **Status:** **[TODO]**
- **Goal:** Polish the experience.
- **Ideas:**
    - **Camera:** Experiment with `reset` logic in `CameraController` (currently damps to center).
    - **Visuals:** Add bloom or particles for "Ignition".

Good luck, Space Cowboy. 🚀
