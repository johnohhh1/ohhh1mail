@echo off
setlocal EnableDelayedExpansion

echo ==========================================
echo    🚀 Starting Superhuman AI Launcher
echo ==========================================
echo.

:: Check if Docker is running
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is NOT running!
    echo.
    echo Please start Docker Desktop and try again.
    echo If you don't have Docker installed, please install it from:
    echo https://www.docker.com/products/docker-desktop
    echo.
    pause
    exit /b 1
)

echo ✅ Docker is running.
echo.

:: Check .env files
if not exist "backend\.env" (
    echo ⚠️  backend\.env not found. Creating from template...
    copy "backend\.env.example" "backend\.env" >nul
    echo ❗ Please edit backend\.env and add your ANTHROPIC_API_KEY if needed.
)

if not exist "frontend\.env.local" (
    echo ⚠️  frontend\.env.local not found. Creating from template...
    copy "frontend\.env.local.example" "frontend\.env.local" >nul
)

:: Start services
echo 🐳 Starting services with Docker Compose...
docker-compose up -d postgres redis ollama

echo ⏳ Waiting for services to initialize...
timeout /t 10 /nobreak >nul

:: Pull Ollama model
echo 📥 Checking/Pulling Ollama model (llama3.2:latest)...
docker-compose exec -T ollama ollama pull llama3.2:latest

:: Start backend and workers
echo 🚀 Starting backend and workers...
docker-compose up -d backend worker beat

echo ⏳ Waiting for backend to be ready...
timeout /t 10 /nobreak >nul

:: Run migrations
echo 🔄 Running database migrations...
docker-compose exec -T backend alembic upgrade head

:: Start frontend
echo 🎨 Starting frontend...
docker-compose up -d frontend

echo.
echo ==========================================
echo    ✅ Superhuman AI is RUNNING!
echo ==========================================
echo.
echo 🌐 Frontend: http://localhost:3040
echo 🔧 Backend API: http://localhost:8001
echo 📚 API Docs: http://localhost:8001/docs
echo.
echo Opening frontend in default browser...
start http://localhost:3040

echo.
echo Press any key to close this launcher (services will keep running).
pause
