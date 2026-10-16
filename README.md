# sv7.dev — Modern Homepage & Dynamic Admin CMS

Welcome to **sv7.dev**, an Apple-inspired minimalist developer portfolio, engineering showcase, and content management system.

## 🚀 Key Highlights

- **Aesthetic**: Clean minimalist / Apple-inspired dark obsidian theme with subtle frosted glass (`backdrop-blur`), refined typography, and high-contrast badges.
- **Dynamic Live CMS**: Built-in Admin Panel accessible at `/admin`. Changes made in the admin console update immediately on the live homepage without code rebuilds.
- **No Database Dependencies**: Powered by an atomic, portable JSON data engine (`data/content.json`). Easy to version control, export, or backup.
- **Tech Stack**:
  - **Framework**: Next.js 14 (App Router)
  - **Styling**: Tailwind CSS with custom Apple-minimalist design tokens
  - **Icons**: Lucide Icons
  - **Type Safety**: 100% TypeScript

---

## 🧭 Project Navigation

- **Main Homepage**: `http://localhost:3000/`
  - **Hero Section**: Headline, tagline, live availability badge with pulsing indicator, high-level metrics.
  - **Featured Projects**: Filter by category ("Systems & Cloud", "Frontend & UI", etc.), interactive architecture modal view, demo and GitHub links.
  - **Skills Matrix**: Categorized tech stack and proficiency badges.
  - **Experience & Milestones**: Clean timeline view with career achievements.
  - **Interactive Terminal**: CLI snippet card mimicking `curl https://sv7.dev/api/content` with response inspector.
  - **Contact & Inquiries**: Direct message composer and social networks grid.
- **Admin Panel**: `http://localhost:3000/admin`
  - **Default Admin Password**: `admin` (can be changed anytime in the Site Settings tab).

---

## ⚙️ Admin Console Features

1. **Profile & Hero**: Edit your name, handle (`sv7`), title, tagline, location, email, and live availability beacon.
2. **Projects Manager**: Add new projects, reorder via Up/Down controls, toggle featured badges, update tags, demo links, and architectural notes.
3. **Skills & Disciplines**: Add/edit categories, modify skill names, and assign proficiency levels.
4. **Experience & Timeline**: Add roles, companies, time periods, summaries, and achievement highlights.
5. **Socials & Links**: Manage links to GitHub, X/Twitter, LinkedIn, Discord, and Email.
6. **Site Settings & Password**: Update site title, SEO metadata, change the admin password, and toggle homepage sections.
7. **Backup & Restore**: One-click download of the entire site JSON configuration, or restore from an uploaded JSON file.

---

## 💻 Development Commands

From inside `/Users/shreyaan/.gemini/antigravity/scratch/sv7-dev`:

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

---

## 🌐 Deploying sv7.dev

### Vercel / Cloudflare / Node Hosting
1. Push this repository to GitHub or GitLab.
2. Link the repository on [Vercel](https://vercel.com).
3. Connect your custom domain `sv7.dev` in DNS settings.
