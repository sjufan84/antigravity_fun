You are picking up a project called **Nebula**, a 3D "Digital Garden".

**Your Mission:**
I need you to "Make it Remember".
1.  **Persistence:** Currently, stars disappear when I refresh. Connect a database (Supabase or simple SQLite/Postgres) to save and load stars.
2.  **Semantic Search:** Build a search bar that uses the existing embedding logic to find relevant stars and fly the camera to them.

**Context:**
- The previous agent (me) implemented **Real AI Embeddings** (using Google Gemini) and **Smooth Camera Transitions**.
- **v0.2 Update**: 
    - Initial camera zoom set to Z=30 for better overview.
    - Connection threshold tuned to 0.5.
    - Camera resets to center focus on close.
- `app/actions.ts` contains `generateEmbedding`.
- `NEBULA_HANDOFF.md` has the details.

**Immediate Goals:**
1.  Set up a database schema for `Stars` (id, content, position, color, embedding).
2.  Update `useGalaxyStore` to fetch from DB on load.
3.  Add a search input that flies the user to the most relevant star.

Go ahead and read the handoff file and let's get started!
