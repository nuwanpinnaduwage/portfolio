# Nuwan Pinnaduwage — Personal Portfolio & Admin CMS

A high-performance, responsive personal portfolio website and private administration dashboard engineered for modern web standards. Built with **React 19**, **Vite 6**, **Tailwind CSS 3**, and backed by **Supabase Cloud PostgreSQL**.

Designed with a high-contrast dark aesthetic featuring **Neon Emerald (`#22c55e`)** accents, accessible light mode support, interactive network topology diagrams, research showcase, ATS-friendly resume viewer, and a real-time admin content management system.

---

## 🌟 Key Features

### 🌐 Public Portfolio Website
- **Modern Cyber & Systems Aesthetic:** Dark mode by default with glowing emerald accents, glassmorphic cards, and high-legibility monospace accents.
- **Dynamic Theme Switcher:** Instant toggle between Dark (`#0a0d0b`) and Light (`#f8fafc`) themes with persistent state.
- **Hero & Live Availability Indicator:** Live status badge (*"AVAILABLE FOR OPPORTUNITIES."*) with real-time viewport activation and social links (LinkedIn, GitHub, TryHackMe, Email).
- **Technical Projects Showcase:** 8 comprehensive engineering projects featuring network topology diagrams, architecture schematics, problem statements, methodology, and metrics.
- **Interactive Multi-Filter System:** Filter projects by domain (*Cybersecurity*, *Computer Networking*, *Artificial Intelligence & Machine Learning*), subcategory, status, or technology tags.
- **Research & Publications Hub:** Showcases peer-reviewed papers with publication venues (IEEE CNS, IEEE ICDCS), DOI badges, methodologies, and paper links.
- **Skills & Competencies:** 34 categorized competencies across 8 technical catalogs with animated visual proficiency meters.
- **Education, Experience & Certifications:** Structured timeline with Dean's List honors, collegiate hackathon victories, TA roles, and verified industry credentials.
- **Interactive Contact Section:** Real-time validated contact form that saves visitor inquiries directly to the Supabase database.
- **ATS Resume Viewer:** In-browser modal for instant CV inspection, printable view, and one-click PDF download.

### 🔒 Private Administrator Dashboard (`/admin`)
- **Secure Authentication:** Administrator portal powered by Supabase GoTrue Auth with protected client-side routes and session management.
- **Full Project CRUD:** Create, edit, reorder, feature, and toggle draft/published status for engineering projects.
- **Research Management:** Manage research papers, authors, abstracts, DOI links, and publication statuses.
- **Skills Catalog Manager:** Manage 8 technical categories, custom proficiency levels, tags, and icon assignments.
- **Site Visibility & Appearance Controls:** Granular toggle controls for individual page sections, navigation items, custom accent colors, typography, and background banners.
- **Storage Asset Uploader:** Drag-and-drop asset uploads directly to Supabase Storage (`portfolio-assets`).
- **Live Staged Preview:** Test and review staged content changes prior to database synchronization.
- **Row Level Security (RLS):** Strict database policies allowing public visitors read-only access to published content, while restricting mutations to authorized administrators.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend Framework** | [React 19](https://react.dev/), [React DOM 19](https://react.dev/) |
| **Routing** | [React Router 7](https://reactrouter.com/) |
| **Build Tool & Bundler** | [Vite 6](https://vitejs.dev/) with Rollup code-splitting |
| **Styling & Design System** | [Tailwind CSS 3](https://tailwindcss.com/), [PostCSS](https://postcss.org/), [Autoprefixer](https://github.com/postcss/autoprefixer) |
| **Animations** | [Motion](https://motion.dev/) (Framer Motion) |
| **Icons** | [Lucide React](https://lucide.dev/), Custom SVG Brand Icons |
| **Backend & Database** | [Supabase](https://supabase.com/) (PostgreSQL 15+, Auth, Storage, Realtime) |
| **Hosting & CI/CD** | [Vercel](https://vercel.com/) (Single Page Application with SPA Rewrites) |

---

## 📁 Project Directory Structure

```
├── public/                     # Static public assets
│   ├── hero-dark.png           # Hero background banner (Dark theme)
│   ├── hero-light.png          # Hero background banner (Light theme)
│   └── _redirects              # Static SPA fallback redirects
├── src/
│   ├── assets/                 # Bundled image assets
│   ├── components/             # Public UI components
│   │   ├── About.jsx           # Bio narrative, highlights, and quick stats
│   │   ├── BrandIcons.jsx      # SVG brand icons (GitHub, LinkedIn, Gmail, etc.)
│   │   ├── Contact.jsx         # Contact form with live Supabase persistence
│   │   ├── CVModal.jsx         # ATS resume modal & printable layout
│   │   ├── Education.jsx       # Academic history and honors
│   │   ├── Experience.jsx      # Industry internship and leadership timeline
│   │   ├── Footer.jsx          # Configurable footer with copyright
│   │   ├── Hero.jsx            # Dynamic hero section with availability badge
│   │   ├── Navbar.jsx          # Header navigation with mobile drawer & theme toggle
│   │   ├── ProjectCard.jsx     # Project showcase cards with tag chips
│   │   ├── ProjectModal.jsx    # Project deep-dive (topologies & architecture)
│   │   ├── Projects.jsx        # Project grid & filter orchestrator
│   │   ├── ResearchCard.jsx    # Research publication card
│   │   ├── ResearchModal.jsx   # Research abstract and methodology modal
│   │   ├── Skills.jsx          # 8-category skill meters with progress bars
│   │   ├── Toast.jsx           # Notification toast alerts
│   │   ├── admin/              # Admin dashboard layout and route guards
│   │   └── animations/         # Reusable scroll reveal & stagger animations
│   ├── context/                # React context providers
│   │   ├── AuthContext.jsx     # Supabase authentication session state
│   │   └── PortfolioContext.jsx # Real-time synchronized portfolio content state
│   ├── data/
│   │   └── portfolioData.js    # Comprehensive fallback & static catalog data
│   ├── lib/
│   │   └── supabase.js         # Supabase client singleton (Anon key only)
│   ├── pages/
│   │   ├── PublicPortfolioPage.jsx # Public single-page portfolio layout
│   │   └── admin/              # Dedicated admin view controllers
│   ├── services/
│   │   └── portfolioService.js # Supabase service layer & database mutations
│   ├── utils/                  # Appearance, visibility, and icon helper utilities
│   ├── App.jsx                 # Application routes & layout wrapper
│   ├── index.css               # Global Tailwind CSS and theme design tokens
│   └── main.jsx                # Application root entry point
├── supabase/
│   ├── migrations/             # Timestamped SQL migration files
│   ├── schema.sql              # Master DDL schema with RLS & tables
│   └── seed.sql                # Complete portfolio seed dataset
├── .env.example                # Template for environment variables
├── .gitignore                  # Production Git ignore rules
├── index.html                  # HTML entry point with meta & fonts
├── package.json                # Project dependencies and npm scripts
├── tailwind.config.js          # Tailwind theme configuration
├── vercel.json                 # Vercel deployment and routing rules
└── vite.config.js              # Vite bundler configuration & code-splitting
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18.0.0 or higher recommended)
- [npm](https://www.npmjs.com/) (version 9.0.0 or higher)

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy the example environment file:
```bash
cp .env.example .env
```

Open `.env` and fill in your Supabase project credentials:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_your_anon_key_here
```

> 🔒 **Security Notice:** Never place `service_role` or database root passwords in `.env` or any client-side code. Only use the public publishable/anon key.

---

## 🗄️ Supabase Backend Setup

If deploying a fresh Supabase project:

1. **Create a Project:**
   - Log in to [Supabase](https://supabase.com/) and create a new project.
2. **Apply Database Schema:**
   - Go to **SQL Editor** in the Supabase Dashboard.
   - Open [`supabase/schema.sql`](supabase/schema.sql), paste its contents, and click **Run**.
   - This creates all 10 tables (`profiles`, `projects`, `skills`, `research`, `certificates`, `education`, `experience`, `achievements`, `site_settings`, `contact_messages`, `admin_users`), enables Row Level Security (RLS), configures policies, and sets up Realtime publication.
3. **Seed Portfolio Data:**
   - Open [`supabase/seed.sql`](supabase/seed.sql), paste its contents into the SQL Editor, and click **Run**.
   - This populates your database with Nuwan Pinnaduwage's projects, skills, research, and profile details.
4. **Create Storage Bucket:**
   - In the Supabase Dashboard, navigate to **Storage**.
   - Create a new bucket named `portfolio-assets`.
   - Set the bucket to **Public** so uploaded avatars and resumes can be downloaded.
5. **Create Admin User:**
   - Go to **Authentication -> Users**.
   - Click **Add User -> Create User**.
   - Enter your admin email and password. Ensure **Auto Confirm Email** is selected.
   - The database trigger automatically registers the new user in `public.admin_users`.

---

## 💻 Local Development & Build Commands

```bash
# Start local development server with Hot Module Replacement (HMR)
npm run dev

# Compile and minify for production
npm run build

# Preview production build locally
npm run preview
```

---

## ☁️ Deploying to Vercel

This repository is pre-configured for seamless single-click deployment on [Vercel](https://vercel.com/):

1. **Push your repository to GitHub.**
2. **Import into Vercel:**
   - Log in to Vercel, click **Add New... -> Project**, and import your GitHub repository.
3. **Configure Project Settings:**
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
4. **Add Environment Variables:**
   Under **Environment Variables**, add:
   - `VITE_SUPABASE_URL`: Your Supabase Project URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase Public/Anon Key
5. **Deploy:** Click **Deploy**. Vercel will build the project and provide your live production URL.

> ℹ️ **Single Page Application (SPA) Routing:** `vercel.json` contains the rewrite rule (`"source": "/(.*)", "destination": "/index.html"`) ensuring direct access to routes like `/admin/login` or `/admin/dashboard` resolves without 404 errors.

---

## 🔒 Security Best Practices

- **Zero Secret Exposure:** Only the public publishable anon key is used on the client. Database passwords and service role keys are excluded from git.
- **Row Level Security (RLS):** Enabled across all database tables. Visitors have read-only access to published content, while write operations are restricted to verified administrators.
- **Input Sanitization:** Contact submissions and admin inputs are validated to prevent malicious payloads.
- **Strict `.gitignore`:** Configured to exclude all local `.env*` files, build output (`dist/`), temporary cache, and sensitive local credential files.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
