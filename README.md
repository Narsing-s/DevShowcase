# DevShowcase

**Discover. Build. Showcase. Connect.**

DevShowcase is a GitHub-first community platform for discovering developer projects and connecting the people behind them. It combines the project-discovery experience already in this repository with community capabilities inspired by modern developer communities: events, open-source collaboration, resources, discussions, mentoring and opportunities.

## Current experience

- Responsive modern project discovery UI
- Search across projects, developers, technologies and categories
- Featured/newest/popular/name sorting
- Favorites and project detail views
- GitHub repository import and public GitHub statistics
- Project submission and moderation-ready backend model
- GitHub profile/member discovery
- Community discussions, comments, activity and notifications
- Events and learning section
- Resource library
- Collaboration requests
- Mentorship and networking flows
- Opportunities board for open source, collaboration, workshops and hackathons
- Dark/light mode and mobile-friendly layout
- PWA manifest/service worker
- Neon/PostgreSQL-ready schema

## Product direction

The goal is not to copy another project. DevShowcase keeps its own visual identity and implementation while bringing together the useful product concepts visible in the referenced Design-and-Code community: people + projects + collaboration + events + resources + mentoring + opportunities.

## Local run

The frontend can be opened directly as a static site. For server/API features, deploy it to a platform that supports the `api/` functions and configure the Neon database connection and GitHub OAuth environment variables used by the API.

### Production setup

1. Create a Neon PostgreSQL database and run the complete `schema.sql` against it. Re-running the file is safe because the tables and indexes use `IF NOT EXISTS`.
2. Configure the variables listed in `.env.example`: `DATABASE_URL`, `SESSION_SECRET`, `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, `APP_URL`, and `ADMIN_GITHUB_LOGINS`.
3. Configure the GitHub OAuth callback as `<APP_URL>/api/auth/github/callback`.
4. Deploy the repository with a platform that supports Node.js serverless functions under `api/`.
5. After deployment, open the site in a fresh browser session. The PWA service worker uses network-first behavior for `/api/*`, so opportunities, events, resources, mentors and discussions are not trapped in an old cache.

### Community API

- `GET /api/community` — discussions
- `POST /api/community` — create a discussion
- `GET /api/community?type=opportunities|resources|events|mentors` — community data
- `POST /api/community?type=opportunities` — publish an opportunity
- `POST /api/community?type=interest` — save opportunity interest
- `POST /api/community?type=resources` — publish a resource
- `POST /api/community?type=events` — publish an event
- `POST /api/community?type=mentorship` — request mentorship

## Data model

schema.sql includes users, projects, follows, likes, discussions, comments, notifications, activity, opportunities, opportunity interests, mentorship requests, resources and events.

## Repository

https://github.com/Narsing-s/DevShowcase
