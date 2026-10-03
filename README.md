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

The frontend can be opened directly as a static site. For server/API features, deploy it to a platform that supports the api/ functions and configure the Neon database connection and GitHub OAuth environment variables used by the API.

## Data model

schema.sql includes users, projects, follows, likes, discussions, comments, notifications, activity, opportunities, opportunity interests, mentorship requests, resources and events.

## Repository

https://github.com/Narsing-s/DevShowcase
