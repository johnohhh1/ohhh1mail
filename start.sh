#!/bin/bash

echo "🚀 Starting Superhuman AI..."

# Check if .env exists
if [ ! -f backend/.env ]; then
    echo "⚠️  No .env file found. Creating from template..."
    cp backend/.env.example backend/.env
    echo "❗ Please edit backend/.env and add your ANTHROPIC_API_KEY"
    exit 1
fi

# Check if .env.local exists
if [ ! -f frontend/.env.local ]; then
    echo "Creating frontend .env.local..."
    cp frontend/.env.local.example frontend/.env.local
fi

# Start services
docker-compose up -d postgres redis ollama

echo "⏳ Waiting for services to be healthy..."
sleep 10

# Pull Ollama model
echo "📥 Pulling Ollama model (this may take a while)..."
docker-compose exec -T ollama ollama pull llama3.2:latest

# Start backend
docker-compose up -d backend worker beat

echo "⏳ Waiting for backend to start..."
sleep 5

# Run migrations
echo "🔄 Running database migrations..."
docker-compose exec -T backend alembic upgrade head

# Start frontend
docker-compose up -d frontend

echo ""
echo "✅ Superhuman AI is running!"
echo ""
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:8000"
echo "📚 API Docs: http://localhost:8000/docs"
echo "🤖 Ollama: http://localhost:11434"
echo ""
echo "📋 View logs:"
echo "  docker-compose logs -f backend"
echo "  docker-compose logs -f frontend"
echo ""
echo "🛑 Stop everything:"
echo "  docker-compose down"
