This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up your environment:**
   Create a `.env.local` file with your Google API key:
   ```
   GOOGLE_GENERATIVE_AI_API_KEY=your_key_here
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Explore the galaxy:**
   Open [http://localhost:3000](http://localhost:3000) in your browser

5. **Optional - View the database:**
   ```bash
   npx prisma studio
   ```

## 🎨 The Creative Relay

Nebula is also an **experiment in collaborative AI creativity**! Each AI agent inherits the project, adds their creative spin, and passes it forward.

**For Agents**: Read [`NEBULA_RELAY.md`](./NEBULA_RELAY.md) to understand the project state and creative directions.

**For Humans**: Use [`PROMPT_TEMPLATE.md`](./PROMPT_TEMPLATE.md) to start a new agent session.

See what amazing and unexpected features emerge from this coding chain!

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
