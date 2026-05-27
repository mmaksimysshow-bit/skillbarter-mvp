# SkillBarter

SkillBarter is a Next.js MVP where users move through a practical path:
`access -> demo -> lesson -> task -> submission -> confirmed case -> Skill ID`.

The project is client-only. There is no backend yet, and user progress is stored locally in the browser through Zustand + `localStorage`.

## Stack

- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- Framer Motion
- Zustand

## Local run

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Production build

```bash
npm run build
npm run start
```

## Main pages

- `/` - landing
- `/access` - login / create profile
- `/demo` - main dashboard
- `/profile`
- `/lessons`
- `/lessons/[id]`
- `/tasks`
- `/tasks/[id]`
- `/courses`
- `/courses/[id]`
- `/projects`
- `/projects/[id]`
- `/mentors`
- `/messages`
- `/skill-id`
- `/settings`
- `/contact`

## Demo scenario

1. Open `/access`
2. Create a demo profile
3. Enter `/demo`
4. Open a lesson and complete it
5. Open a task and submit a result
6. Confirm the task
7. Open `/skill-id` and check earned skills and confirmed cases

## Multi-user localStorage

SkillBarter uses a shared persisted store with the key `skillbarter-storage-v3`.

Inside that store, the app now keeps:

- `accounts`
- `activeUserId`
- one personal workspace per user

Each workspace contains its own:

- lessons
- tasks
- earned skills
- confirmed cases
- messages
- bookings
- notifications
- activity
- contact requests

That means different users on the same browser do not share progress.

## MVP limitations

- No backend
- No real authentication provider
- No database
- No server-side user sessions
- All progress is stored only in the current browser

For a real production product, the next step after this MVP is adding a backend for auth, storage, sync, and moderation.

## GitHub

1. Create a new GitHub repository.
2. Initialize git locally if needed:

```bash
git init
git add .
git commit -m "Initial SkillBarter MVP"
```

3. Add your remote:

```bash
git remote add origin https://github.com/<your-account>/<your-repo>.git
git branch -M main
git push -u origin main
```

## Vercel deploy

SkillBarter is prepared as a regular Next.js app for Vercel.

1. Push the project to GitHub.
2. Open Vercel.
3. Import the GitHub repository.
4. Let Vercel detect `Next.js`.
5. Keep the default build settings.
6. Deploy.

Important:

- do not use GitHub Pages for this project
- do not add `output: export`
- do not convert routes to static export mode

## Notes before publishing

- Build should pass with `npm run build`
- Internal app pages require an active profile and redirect through `/access`
- Invalid dynamic ids show a safe empty state instead of crashing
- Contact form, logout, notifications, and multi-user workspaces are client-only MVP behavior
