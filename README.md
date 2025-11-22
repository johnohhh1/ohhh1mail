# Ohhh1Mail AI

A production-ready, AI-powered email client featuring real-time updates, intelligent email categorization, and AI-assisted composition.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/python-3.11-blue.svg)
![Next.js](https://img.shields.io/badge/next.js-14-black.svg)

## 🚀 Features

### Email Management
- 📧 **Real IMAP/SMTP Integration** - Connect Gmail, Outlook, or any email provider
- 🔄 **Background Email Sync** - Automatic email fetching with Celery workers
- ⚡ **Real-time Updates** - WebSocket-powered instant notifications
- 🔍 **Smart Search** - Full-text search across all emails
- ⭐ **Email Organization** - Star, archive, mark as read/unread

### AI-Powered Features
- 🤖 **AI Email Summaries** - One-line summaries for every email
- 🎯 **Smart Categorization** - Automatic inbox sorting (Focused, Team, VIP, Other)
- ✍️ **AI Compose** - Generate emails from simple prompts
- 💬 **Quick Replies** - AI-generated contextual response options
- 🔀 **Dual AI Backend** - Ollama (self-hosted) with Claude API fallback

### User Experience
- ⌨️ **Keyboard Shortcuts** - Lightning-fast navigation
- 🎨 **Modern UI** - Clean, minimal design with Tailwind CSS
- 📱 **Responsive** - Works on desktop and mobile
- 🔐 **Secure Authentication** - JWT-based auth with password hashing

---

## 📦 Tech Stack

### Frontend
- **Framework**: Next.js 14 (React 18)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Real-time**: WebSocket (native)
- **HTTP Client**: Fetch API

### Backend
- **Framework**: FastAPI (Python 3.11)
- **Database**: PostgreSQL 15
- **ORM**: SQLAlchemy (async)
- **Cache/Queue**: Redis
- **Task Queue**: Celery + Celery Beat
- **Email**: IMAPClient + aiosmtplib
- **AI Services**: 
  - Ollama (primary - self-hosted)
  - Claude API (fallback - always available)

### Infrastructure
- **Containerization**: Docker + Docker Compose
- **Reverse Proxy**: Caddy (production)
- **Deployment**: Railway / Vercel / Self-hosted VPS

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND (Next.js)                       │
│  localhost:3040 - React components, WebSocket client         │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────────────────┐
│                  BACKEND API (FastAPI)                       │
│  localhost:8001 - REST endpoints, WebSocket server           │
└───┬─────────────────┬────────────────────┬──────────────────┘
    │                 │                    │
    ↓                 ↓                    ↓
┌───────────┐  ┌──────────────┐   ┌─────────────────┐
│   Redis   │  │    Celery    │   │   PostgreSQL    │
│ localhost │  │   Workers    │   │  localhost:5432 │
│   :6379   │  │              │   │                 │
│           │  │ - Email sync │   │ - Users         │
│ - Queue   │  │ - AI tasks   │   │ - Emails        │
│ - Cache   │  │ - Scheduling │   │ - Settings      │
└───────────┘  └──────────────┘   └─────────────────┘
                       │
                       ↓
              ┌─────────────────┐
              │   AI Services   │
              │                 │
              │ 1. Ollama       │  ← localhost:11434
              │    (Primary)    │    Self-hosted, free
              │                 │
              │ 2. Claude API   │  ← Always-on fallback
              │    (Fallback)   │    Reliable backup
              └─────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites

- **Docker Desktop** (for Windows/Mac) or Docker Engine (Linux)
- **Git Bash** (Windows) or Terminal (Mac/Linux)
- **Claude API Key** (get from https://console.anthropic.com)
- *(Optional)* Ollama installed locally for AI features

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd superhuman-ai
```

2. **Configure environment variables**
```bash
# Create .env file in project root
cat > .env << EOF
ANTHROPIC_API_KEY=your_claude_api_key_here
EOF

# Edit backend/.env if needed
nano backend/.env
```

3. **Start all services**
```bash
# Using the provided start script
./start.sh

# OR manually with docker-compose
docker-compose up -d

# Check status
docker-compose ps
```

4. **Access the application**
- Frontend: http://localhost:3040
- Backend API: http://localhost:8001
- API Docs: http://localhost:8001/docs

### First-Time Setup

1. **Create an account** at http://localhost:3040
2. **Connect your email**:
   - Go to Settings (not implemented yet in UI, coming soon)
   - For now, use the API directly or wait for email connection UI

3. **For Gmail Users**:
   - Enable 2FA in Google Account settings
   - Generate an App Password
   - Use the app password (not your regular password)

---

## 🛠️ Development

### Project Structure

```
superhuman-ai/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI app entry point
│   │   ├── config.py            # Configuration settings
│   │   ├── database.py          # Database setup
│   │   ├── models.py            # SQLAlchemy models
│   │   ├── schemas.py           # Pydantic schemas
│   │   ├── routers/             # API route handlers
│   │   ├── services/            # Business logic
│   │   │   ├── imap_service.py  # Email fetching
│   │   │   ├── smtp_service.py  # Email sending
│   │   │   └── ai_service.py    # AI integrations
│   │   ├── tasks/               # Celery tasks
│   │   └── utils/               # Helper functions
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env
│
├── frontend/
│   ├── app/
│   │   ├── page.tsx            # Login page
│   │   ├── layout.tsx          # Root layout
│   │   └── dashboard/
│   │       └── page.tsx        # Main dashboard
│   ├── components/
│   │   ├── Sidebar.tsx         # Navigation
│   │   ├── EmailList.tsx       # Email list view
│   │   ├── EmailDetail.tsx     # Email detail view
│   │   ├── Compose.tsx         # Compose email
│   │   └── WebSocketProvider.tsx
│   ├── lib/
│   │   └── api.ts              # API client
│   ├── package.json
│   └── .env.local
│
├── docker-compose.yml
├── start.sh
└── README.md
```

### Running Locally (Development Mode)

**Backend** (with hot reload):
```bash
docker-compose up backend
# Logs appear in real-time
```

**Frontend** (with hot reload):
```bash
docker-compose up frontend
# Next.js hot reloads on file changes
```

**View Logs**:
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f worker
```

### Making Changes

**Backend changes** (Python):
- Edit files in `backend/app/`
- Container auto-reloads (thanks to uvicorn --reload)

**Frontend changes** (React/TypeScript):
- Edit files in `frontend/`
- Next.js hot reloads automatically

**Database changes**:
```bash
# Access database
docker-compose exec postgres psql -U postgres -d superhuman

# Run migrations (when you set them up)
docker-compose exec backend alembic upgrade head
```

---

## 🤖 AI Configuration

### Ollama (Self-Hosted - Recommended)

1. **Install Ollama** on your host machine:
```bash
# Windows: Download from ollama.com
# Mac: brew install ollama
# Linux: curl -fsSL https://ollama.com/install.sh | sh
```

2. **Pull a model**:
```bash
ollama pull llama3.2:latest
# OR use a larger model
ollama pull gpt-oss:120b-cloud  # If you have GPU
```

3. **Verify it's running**:
```bash
curl http://localhost:11434/api/tags
```

The backend will automatically detect and use your local Ollama instance.

### Claude API (Fallback)

Set your API key in `.env`:
```bash
ANTHROPIC_API_KEY=sk-ant-your-key-here
```

The system automatically falls back to Claude if:
- Ollama is unavailable
- Ollama times out
- You set `OLLAMA_ENABLED=false`

### AI Priority

1. **Try Ollama first** (fast, free, runs locally)
2. **Fall back to Claude** (reliable, always available)

This ensures your app never breaks even if Ollama is down!

---

## 📧 Email Configuration

### Supported Providers

- ✅ Gmail (recommended)
- ✅ Outlook / Office 365
- ✅ Yahoo Mail
- ✅ Any IMAP/SMTP provider

### Gmail Setup

1. **Enable 2-Factor Authentication**
   - Go to Google Account → Security
   - Turn on 2-Step Verification

2. **Generate App Password**
   - Google Account → Security → 2-Step Verification
   - Scroll to "App passwords"
   - Generate new app password
   - Copy the 16-character password

3. **Use App Password** (not your regular Gmail password!)

### Email Sync Settings

In `backend/.env`:
```bash
EMAIL_SYNC_INTERVAL=30  # Sync every 30 seconds
EMAIL_BATCH_SIZE=50     # Fetch 50 emails per sync
```

---

## 🚢 Deployment

### Option 1: Railway (Recommended - All-in-One)

**Cost**: ~$20-40/month

1. Install Railway CLI:
```bash
npm install -g @railway/cli
```

2. Deploy:
```bash
railway login
railway init
railway up
```

3. Add services:
- PostgreSQL (addon)
- Redis (addon)
- Backend (from Dockerfile)
- Frontend (deploy to Vercel separately)

### Option 2: Vercel + Railway (Hybrid)

**Cost**: ~$50/month

**Frontend** (Vercel - Free):
```bash
cd frontend
vercel --prod
```

**Backend** (Railway):
- Deploy backend, Celery workers, PostgreSQL, Redis to Railway
- Point frontend to Railway backend URL

### Option 3: Self-Hosted VPS

**Cost**: €20/month (Hetzner)

```bash
# On your VPS
git clone your-repo
cd superhuman-ai

# Copy production compose file
cp docker-compose.prod.yml docker-compose.yml

# Start
docker-compose up -d

# Setup reverse proxy (Caddy)
# Access via your-domain.com
```

### Environment Variables (Production)

```bash
# Backend
DATABASE_URL=postgresql+asyncpg://user:pass@host/db
REDIS_URL=redis://host:6379/0
ANTHROPIC_API_KEY=your_key
SECRET_KEY=random_secret_key_here
OLLAMA_BASE_URL=http://your-ollama-server:11434
CORS_ORIGINS=["https://your-frontend.vercel.app"]

# Frontend
NEXT_PUBLIC_API_URL=https://your-backend.railway.app
NEXT_PUBLIC_WS_URL=wss://your-backend.railway.app
```

---

## 🔧 Configuration

### Backend Settings (`backend/.env`)

```bash
# Database
DATABASE_URL=postgresql+asyncpg://postgres:password@postgres:5432/superhuman

# Redis
REDIS_URL=redis://redis:6379/0

# AI
ANTHROPIC_API_KEY=sk-ant-your-key
OLLAMA_BASE_URL=http://host.docker.internal:11434
OLLAMA_MODEL=llama3.2:latest
OLLAMA_ENABLED=true
USE_CLAUDE_FALLBACK=true

# Security
SECRET_KEY=change-this-in-production

# Email Sync
EMAIL_SYNC_INTERVAL=30
EMAIL_BATCH_SIZE=50
```

### Frontend Settings (`frontend/.env.local`)

```bash
NEXT_PUBLIC_API_URL=http://localhost:8001
NEXT_PUBLIC_WS_URL=ws://localhost:8001
```

---

## 🐛 Troubleshooting

### Port Conflicts

**Error**: `port already in use`

**Solution**:
```bash
# Check what's using the port
netstat -ano | findstr :8001  # Windows
lsof -i :8001                 # Mac/Linux

# Kill the process or change ports in docker-compose.yml
```

### Backend Not Responding

**Error**: Frontend shows 500 or connection errors

**Solution**:
```bash
# Check backend logs
docker-compose logs backend

# Restart backend
docker-compose restart backend

# Rebuild if needed
docker-compose up -d --build backend
```

### Database Connection Issues

**Error**: `could not connect to database`

**Solution**:
```bash
# Check if PostgreSQL is running
docker-compose ps

# Restart database
docker-compose restart postgres

# Check database logs
docker-compose logs postgres
```

### Ollama Not Working

**Error**: AI features timing out

**Solution**:
```bash
# Check if Ollama is running
curl http://localhost:11434/api/tags

# Start Ollama
ollama serve

# Check backend can reach it
docker-compose exec backend curl http://host.docker.internal:11434
```

The system will automatically fall back to Claude API if Ollama fails!

### CORS Errors

**Error**: `blocked by CORS policy`

**Solution**:
```bash
# Check CORS settings in backend/app/main.py
# Make sure your frontend URL is in the allow_origins list

# Restart backend after changes
docker-compose restart backend
```

---

## 📝 API Documentation

Access interactive API docs:
- **Swagger UI**: http://localhost:8001/docs
- **ReDoc**: http://localhost:8001/redoc

### Key Endpoints

**Authentication**:
- `POST /auth/register` - Create new account
- `POST /auth/login` - Login

**Emails**:
- `GET /emails` - List emails (with filters)
- `GET /emails/{id}` - Get single email
- `POST /emails/send` - Send email
- `POST /emails/sync` - Trigger email sync
- `PATCH /emails/{id}/star` - Star/unstar email

**AI**:
- `POST /ai/compose` - Generate email from prompt
- `POST /ai/quick-replies/{id}` - Generate quick reply options

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

MIT License - see LICENSE file for details

---

## 🙏 Acknowledgments

- Built with [FastAPI](https://fastapi.tiangolo.com)
- Powered by [Anthropic Claude](https://www.anthropic.com)
- AI by [Ollama](https://ollama.ai)

---

## 📞 Support

- **Issues**: [GitHub Issues](your-repo/issues)
- **Discussions**: [GitHub Discussions](your-repo/discussions)
- **Email**: your-email@example.com

---

## 🗺️ Roadmap

- [ ] Email templates
- [ ] Scheduled sending
- [ ] Email tracking (read receipts)
- [ ] Mobile app (React Native)
- [ ] Calendar integration
- [ ] Team collaboration features
- [ ] Custom AI model training
- [ ] Multi-language support
- [ ] Dark mode
- [ ] Email rules/filters UI

---

**Built with ❤️ by [Your Name]**

**What work are you avoiding that would move you forward?** 😉
