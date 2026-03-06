# Deployment and env notes

- The waitlist form posts to the URL in VITE_WAITLIST_ENDPOINT (POST JSON: { email, goal, platform }).
- Founding price displayed is read from VITE_FOUNDING_PRICE.
- Example env for production is in .env.production.

Vercel setup
1. Create a new Vercel project and connect to this GitHub repo.
2. Set the following environment variables in Vercel (Project > Settings > Environment Variables):
   - VITE_WAITLIST_ENDPOINT (e.g. https://api.example.com/waitlist)
   - VITE_FOUNDING_PRICE (e.g. 59)
3. Build command: npm run build (or leave default for Vite). Output directory: (leave empty).

Local dev
- Run: npm install && npm run dev
