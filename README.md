# DevShowcase ✦

**Discover. Build. Showcase. Connect.**

DevShowcase is a GitHub-first project discovery and developer community platform bringing projects, people, discussions, events, resources, mentorship, collaboration and opportunities into one modern experience.

> An independent implementation inspired by modern open-source community patterns, with its own UI, data model and workflows.

## ✨ What you can do

| Area | Experience |
|---|---|
| 🔎 Discover | Search, filter and sort projects by category, technology, popularity and recency |
| 🚀 Showcase | Submit projects, import public GitHub repositories and open project details |
| ❤️ Personalize | Save favorites and share projects |
| 👥 People | Explore GitHub members and developer profiles |
| 💬 Community | Start discussions, reply with comments and view activity |
| 🤝 Collaborate | Create collaboration requests and connect with builders |
| 🎓 Mentorship | Request mentorship or offer yourself as a mentor |
| 📅 Events | Publish community events and mark interest |
| 📚 Resources | Publish and discover learning resources |
| 🌱 Opportunities | Share open-source, hackathon, workshop and collaboration opportunities |
| 🛡️ Moderation | Review project submissions with approve/reject workflows |
| 📱 PWA | Responsive installable experience with offline-friendly local mode |
| 🌙 UI | Modern responsive layout with dark/light theme support |

## 🧭 Product structure

DevShowcase follows a simple lifecycle:

**Discover → Explore → Connect → Collaborate → Learn → Showcase**

### Main navigation
- **Home** — product overview and featured content
- **Projects** — searchable project showcase
- **About** — platform mission and community direction
- **Features** — platform capabilities
- **Events** — community activities and workshops
- **Community** — discussions, activity and notifications
- **Team** — contributors and maintainers
- **Contact** — contribution and issue-reporting paths

## 🧩 Architecture

```text
DevShowcase
├── index.html              # Main application shell
├── src/app.js              # Frontend application logic
├── src/styles.css          # Design system and responsive UI
├── src/components/         # Migration-friendly component structure
├── src/pages/              # Page structure
├── src/hooks/              # Hook structure
├── src/lib/                # Shared frontend utilities
├── api/                    # Serverless API endpoints
├── schema.sql              # PostgreSQL/Neon schema
├── manifest.webmanifest    # PWA metadata
├── sw.js                   # Service worker
├── vercel.json             # Security configuration
└── .github/workflows/ci.yml# CI validation
```

The current frontend intentionally stays lightweight and framework-free while retaining a migration-friendly `src/` structure.

## 💾 Operating modes

### Server mode
Shared production data uses PostgreSQL/Neon and GitHub OAuth.

Required environment variables are documented in `.env.example`:
- `DATABASE_URL`
- `SESSION_SECRET`
- `GITHUB_CLIENT_ID`
- `GITHUB_CLIENT_SECRET`
- `APP_URL`
- `ADMIN_GITHUB_LOGINS`
- `DB_INIT_SECRET`

Apply the complete `schema.sql` before using production API features.

### Local Test Mode
If the API/database is unavailable, DevShowcase automatically switches to a device-local test account and persists supported interactions in `localStorage`.

Supported local flows include project submissions, favorites, discussions, comments, opportunities, opportunity interests, events, event interest, resources, mentorship requests, collaboration requests, likes/follows, activity, notifications and local moderation.

Local data also has JSON export/reset helpers. Local mode is device-specific and is not a replacement for server-side authentication or a shared production database.

## 🔐 Security

- Signed, expiring HTTP-only session cookies
- GitHub OAuth state validation
- Server-side authentication and admin checks
- Input validation for project submissions
- GitHub repository hostname validation
- Duplicate-safe project submission
- Security headers and HTTPS/HSTS configuration
- Service worker avoids caching non-GET API requests
- Health endpoint avoids exposing raw database errors

See `SECURITY.md` for vulnerability reporting.

## 🗃️ Data model

`schema.sql` covers users, projects, follows, project likes, discussions, comments, notifications, activity, opportunities, opportunity interests, mentorship requests, resources and events.

## 🔌 API surface

### Projects
GET /api/projects
POST /api/projects

### Community
GET /api/community
POST /api/community
GET /api/community?type=opportunities|resources|events|mentors
POST /api/community?type=opportunities|interest|resources|events|mentorship

### Social
POST /api/social — follow/unfollow and like/unlike

### Comments
GET /api/community/comments?discussionId=<id>
POST /api/community/comments

### Platform
GET /api/activity
GET /api/notifications
PATCH /api/notifications
GET /api/profile?login=<github-login>
GET /api/health
GET /api/admin/projects
PATCH /api/admin/projects

## 🚀 Getting started

Requirements: Node.js 20+, PostgreSQL/Neon for shared server mode, a GitHub OAuth application, and a deployment platform that supports Node.js serverless functions.

1. Create a PostgreSQL/Neon database.
2. Apply `schema.sql`.
3. Configure `.env.example` values.
4. Configure the GitHub OAuth callback as `<APP_URL>/api/auth/github/callback`.
5. Deploy the repository.
6. Open the application in a fresh browser session.
7. Check `/api/health` for database connectivity.

## 🧪 Quality checks

The GitHub Actions workflow validates JavaScript syntax, frontend syntax, JSON configuration, required files and Node.js compatibility.

Recommended checks:
```bash
npm install --ignore-scripts
node --check src/app.js
find api -name '*.js' -print0 | xargs -0 -n1 node --check
```

## 🤝 Open-source workflow

Fork → Branch → Build → Validate → Pull Request → Review → Merge

See `docs/CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md` and `.github/ISSUE_TEMPLATE/`.

## 🗺️ Roadmap

**Current:** discovery, community workflows, Local Test Mode, Neon backend, GitHub authentication, PWA and moderation.

**Next:** richer profiles, project collections, saved searches, richer notifications, collaboration inbox, event registration records and improved moderation.

**Future:** framework component migration, advanced analytics, realtime community features and expanded integrations.

## 📌 Repository

https://github.com/Narsing-s/DevShowcase

## 📄 License

See `LICENSE` for the repository's current open-source license.

**DevShowcase — discover great work, meet the builders, and turn projects into collaboration.**