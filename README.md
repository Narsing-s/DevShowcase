# ✦ DevShowcase

<p align="center">
  <strong>Discover. Build. Showcase. Connect.</strong><br>
  A modern open-source home for developer projects, builders, collaboration and community.
</p>

<p align="center">
  <a href="https://github.com/Narsing-s/DevShowcase/actions">CI</a> ·
  <a href="https://github.com/Narsing-s/DevShowcase/issues">Issues</a> ·
  <a href="https://github.com/Narsing-s/DevShowcase/pulls">Pull Requests</a> ·
  <a href="https://github.com/Narsing-s/DevShowcase/blob/main/LICENSE">License</a>
</p>

---

## 🌌 The idea

DevShowcase is more than a project gallery.

It is designed as a **developer discovery + community layer** where people can:

**Show what they built → discover other builders → start conversations → find collaborators → learn → participate → build again.**

The experience combines project discovery, GitHub importing, developer profiles, social actions, discussions, mentorship, collaboration, opportunities, events and resources.

---

## ⚡ Product at a glance

| 🧭 Discover | 🚀 Showcase | 🤝 Connect |
|---|---|---|
| Search & filters | Submit projects | Follow builders |
| Categories & tags | GitHub import | Like projects |
| Featured projects | Project details | Developer profiles |
| Popularity & recency | Favorites & sharing | Discussions |

| 🌱 Participate | 🧠 Learn | 🛡️ Operate |
|---|---|---|
| Opportunities | Mentorship | Moderation |
| Events | Resources | GitHub OAuth |
| Collaboration | Community discussions | PostgreSQL / Neon |
| Event interest | Comments & activity | Security headers |

---

## ✨ Core experience

### 🔎 Project discovery
- Search by name, description, author, category and technology.
- Sort by newest, popularity and other showcase signals.
- Browse featured projects and technology tags.
- Open GitHub repositories and optional live demos.
- Refresh public GitHub metadata.

### 📦 Project publishing
- Submit a project for moderation.
- Validate GitHub repository URLs.
- Prevent duplicate repository submissions.
- Support optional live-demo URLs.
- Import public repositories directly from GitHub.

### 👤 Developer profiles
- GitHub-backed identity.
- Profile avatar, bio and website.
- Follower/following relationships.
- Published project collection.
- Project likes and community activity.

### 💬 Community
- Start discussions.
- Comment on discussions.
- Browse activity.
- Receive notifications.
- Connect discussion topics with projects.

### 🤝 Collaboration
Create structured collaboration requests with:
- title
- details
- technology
- profile/project URL
- open status

### 🎓 Mentorship
- Become a mentor.
- Add mentorship expertise.
- Maintain a mentor profile.
- Request mentorship from community members.
- Prevent duplicate pending mentorship requests.

### 🌱 Opportunities
Create and discover:
- Open-source contribution opportunities
- Collaboration opportunities
- Hackathons
- Workshops
- Mentorship opportunities

### 📅 Events & 📚 Resources
- Publish community events.
- Add event dates and links.
- Mark event interest.
- Publish learning resources.
- Organize resources by category.

---

## 📴 Local Test Mode

No database? No problem.

When the backend is unavailable, DevShowcase can switch to a **device-local test account** using browser storage.

Local workflows cover:

- Projects
- Favorites
- Discussions
- Comments
- Likes
- Follows
- Opportunities
- Opportunity interests
- Events
- Event attendance
- Resources
- Mentorship
- Mentor profiles
- Collaboration requests
- Activity
- Notifications
- Local moderation

The UI also exposes **Export local data** and **Reset local data** controls.

> Local Test Mode is intended for development/demo testing. It is not a replacement for server-side authentication or shared production persistence.

---

## 🏗️ Architecture

```text
┌──────────────────────────────────────────────────────────────┐
│                         DevShowcase                           │
├──────────────────────────────────────────────────────────────┤
│  Responsive UI · Dark/Light · PWA · Local Test Mode          │
├──────────────────────────────────────────────────────────────┤
│  Projects · Profiles · Community · Events · Resources        │
│  Mentorship · Collaboration · Opportunities · Social        │
├──────────────────────────────────────────────────────────────┤
│  Serverless API · GitHub OAuth · Security Middleware         │
├──────────────────────────────────────────────────────────────┤
│                         PostgreSQL / Neon                     │
└──────────────────────────────────────────────────────────────┘
```

### Repository structure

```text
DevShowcase/
├── index.html
├── src/
│   ├── app.js
│   ├── styles.css
│   ├── components/
│   ├── layouts/
│   ├── pages/
│   ├── hooks/
│   └── lib/
├── api/
│   ├── _lib.js
│   ├── projects.js
│   ├── project.js
│   ├── profile.js
│   ├── social.js
│   ├── community.js
│   ├── community/comments.js
│   ├── activity.js
│   ├── notifications.js
│   ├── health.js
│   ├── admin/projects.js
│   └── auth/
├── schema.sql
├── manifest.webmanifest
├── sw.js
├── vercel.json
├── docs/
└── .github/
```

The frontend is intentionally lightweight today. The `src/` structure keeps the codebase ready for a future component-framework migration without requiring one now.

---

## 🔐 Security model

DevShowcase includes several defensive layers:

- Signed, expiring HTTP-only sessions.
- Secure/SameSite session-cookie configuration.
- GitHub OAuth state validation.
- Server-side authentication checks.
- Admin allow-list support.
- GitHub hostname validation.
- Project duplicate protection.
- Input length and payload validation.
- Security response headers.
- HSTS configuration.
- Non-GET requests excluded from service-worker caching.
- Health endpoint that avoids exposing raw database errors.

For security reports, see **[SECURITY.md](SECURITY.md)**.

---

## 🗃️ Database

The PostgreSQL schema includes:

```text
users
projects
follows
project_likes
discussions
discussion_comments
notifications
activity
opportunities
opportunity_interests
mentorship_requests
mentor_profiles
collaboration_requests
resources
events
event_attendees
```

Foreign keys, cascade rules and useful indexes are included in `schema.sql`.

---

## 🔌 API map

| Endpoint | Purpose |
|---|---|
| `GET /api/projects` | Approved project discovery |
| `POST /api/projects` | Submit a project |
| `GET /api/project?id=...` | Project details |
| `POST /api/project?id=...` | Increment project view |
| `GET /api/profile?login=...` | Developer profile |
| `POST /api/social` | Follow/unfollow and like/unlike |
| `GET/POST /api/community` | Discussions and community collections |
| `GET/POST /api/community?type=...` | Events, resources, opportunities, mentors, collaboration and mentorship |
| `GET/POST /api/community/comments` | Discussion comments |
| `GET /api/activity` | Community activity |
| `GET/PATCH /api/notifications` | Notifications |
| `GET /api/me` | Current session |
| `GET /api/health` | Database health |
| `GET/PATCH /api/admin/projects` | Moderation |

---

## 🚀 Quick start

### Requirements

- Node.js **20+**
- PostgreSQL / Neon for shared server mode
- GitHub OAuth application for sign-in
- A serverless-capable deployment environment for API routes

### 1. Clone

```bash
git clone https://github.com/Narsing-s/DevShowcase.git
cd DevShowcase
```

### 2. Install

```bash
npm install --ignore-scripts
```

### 3. Configure environment

Copy `.env.example` into your deployment environment and configure:

```text
DATABASE_URL
SESSION_SECRET
GITHUB_CLIENT_ID
GITHUB_CLIENT_SECRET
APP_URL
ADMIN_GITHUB_LOGINS
DB_INIT_SECRET
```

### 4. Prepare the database

Run the complete `schema.sql` against your PostgreSQL/Neon database.

### 5. Configure GitHub OAuth

Set the callback URL to:

```text
<APP_URL>/api/auth/github/callback
```

### 6. Run validation

```bash
node --check src/app.js
find api -name '*.js' -print0 | xargs -0 -n1 node --check
```

Then serve the repository with your preferred local static/serverless development environment.

---

## 🧪 CI

GitHub Actions validates:

- Node.js compatibility
- Frontend JavaScript syntax
- API JavaScript syntax
- JSON configuration
- Required application files

Workflow:

```text
Commit / Pull Request
        ↓
Install dependencies
        ↓
Validate JavaScript
        ↓
Validate configuration
        ↓
Validate required files
        ↓
Ready for review
```

---

## 🧭 Product navigation

```text
Home
 ├─ Projects
 ├─ About
 ├─ Features
 ├─ Events
 ├─ Community
 ├─ Team
 └─ Contact

Community
 ├─ Discussions
 ├─ Collaboration
 ├─ Mentorship
 ├─ Opportunities
 ├─ Events
 └─ Resources
```

---

## 🗺️ Roadmap

### 🟢 Foundation
- [x] Project discovery
- [x] GitHub import
- [x] Favorites
- [x] Social actions
- [x] Discussions and comments
- [x] Events and resources
- [x] Mentorship
- [x] Collaboration
- [x] Opportunities
- [x] Moderation
- [x] GitHub OAuth
- [x] PostgreSQL/Neon schema
- [x] Local Test Mode
- [x] PWA support
- [x] Security hardening

### 🟡 Expansion
- [ ] Rich project collections
- [ ] Saved searches
- [ ] Collaboration inbox
- [ ] Rich notification center
- [ ] Event registration management
- [ ] Advanced moderation dashboard
- [ ] Better project analytics

### 🔵 Long term
- [ ] Realtime collaboration
- [ ] Advanced discovery/recommendation
- [ ] More integrations
- [ ] Framework-based component migration
- [ ] Expanded developer analytics

---

## 🤝 Contributing

DevShowcase is built to be extended by developers.

```text
Fork
 ↓
Branch
 ↓
Build
 ↓
Validate
 ↓
Pull Request
 ↓
Review
 ↓
Merge
```

Before contributing, read:

- [CONTRIBUTING](docs/CONTRIBUTING.md)
- [Code of Conduct](CODE_OF_CONDUCT.md)
- [Security](SECURITY.md)
- [Issue templates](.github/ISSUE_TEMPLATE/)

---

## 📁 Project links

- **Repository:** https://github.com/Narsing-s/DevShowcase
- **Issues:** https://github.com/Narsing-s/DevShowcase/issues
- **Pull requests:** https://github.com/Narsing-s/DevShowcase/pulls

---

## 📜 License

See [LICENSE](LICENSE) for the repository's current license.

---

<p align="center">
  <strong>✦ DevShowcase</strong><br>
  <sub>Show your work. Find your people. Build what's next.</sub>
</p>
