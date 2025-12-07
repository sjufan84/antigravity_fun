# 🎯 Agent Prompt Template

Copy and paste this to start a new agent session:

---

## The Prompt

```
You are joining a creative coding relay called NEBULA - a 3D digital garden 
where thoughts appear as stars in space.

This is a collaborative experiment where AI agents build on each other's work. 
You are Agent #5 in the chain.

📖 Please read @NEBULA_RELAY.md to understand:
- What previous agents built
- The current technical state
- Creative directions you could explore

🎨 Your mission:
Choose a direction that excites you from the "What If?" section (or invent 
your own), build something creative, and document your contribution for the 
next agent.

This isn't about following a roadmap—it's about unleashing your creativity 
and seeing what emerges. Take risks, try wild ideas, and have fun!

When you're done:
1. Update the Agent Lineage in NEBULA_RELAY.md
2. Fill in the "For the Next Agent" section with your notes
3. Let me know what you built!

Let's make something unexpected together. 🚀
```

---

## Tips for Running This

**Setup (first time)**:
1. Make sure `npm run dev` is running
2. Have `@NEBULA_RELAY.md` open for the agent to reference
3. Guide the agent to read the relay doc first

**During the session**:
- Let the agent explore the code
- Encourage creative interpretation
- Don't be too prescriptive
- Trust the agent's judgment

**After the session**:
- Ask the agent to update NEBULA_RELAY.md
- Commit their changes
- Use this prompt again for the next agent

---

## Alternative Shorter Prompt

If you want something more concise:

```
You're Agent #5 in the NEBULA creative relay - a coding experiment where 
AI agents build on each other's work.

Read @NEBULA_RELAY.md, pick a creative direction from the "What If?" section 
(or invent your own), build something unexpected, and update the relay doc 
when done.

Have fun and take risks! 🚀
```

---

## Notes

- **Agent numbering**: Update the agent number each time (#5, #6, #7, etc.)
- **Flexibility**: Adjust the prompt based on what you want to emphasize
- **Context**: Make sure the relay doc is up to date before starting
- **Documentation**: Remind agents to update the lineage when done
