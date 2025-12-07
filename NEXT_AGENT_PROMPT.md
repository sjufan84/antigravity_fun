You are picking up a project called **Nebula**, a 3D "Digital Garden".

**Your Mission:**
I need you to "Make it Shine".
1.  **Visual Polish:** The stars are just points. Make them glow? Add particle effects on hover?
2.  **Performance Check:** We are loading all stars at once. If we get to 1000 stars, does it lag? Maybe implement some culling or optimization.
3.  **Refinement:** The "Constellations" lines are currently random/threshold based. Can we make them more intelligent?

**Context:**
- The previous agent (me) implemented **Persistence** (Prisma/SQLite) and **Semantic Search**.
- **v0.3 Update**: 
    - Database: SQLite (`dev.db`) with Prisma 7 + `@prisma/adapter-better-sqlite3`.
    - Search: In-memory cosine similarity on 3072-dim embeddings.
    - UI: Added `SearchBar` to `InterfaceOverlay`.
    - Camera: OrbitControls enabled (pan, zoom, rotate). Auto-focus on star click/search.
- `app/actions.ts` handles DB logic (createStar/getStars/searchStars).
- `lib/prisma.ts` uses driver adapter pattern (required for Prisma 7 + SQLite).
- `useGalaxyStore` loads stars on mount.

Go ahead and read the handoff file and let's get started!
