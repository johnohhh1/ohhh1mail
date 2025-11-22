#!/bin/bash

echo "🔧 Manual Setup (Without Docker)"

# Backend setup
echo "Setting up backend..."
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Create .env if not exists
if [ ! -f .env ]; then
    cp .env.example .env
    echo "❗ Please edit backend/.env with your credentials"
fi

# Run migrations
alembic init alembic
alembic revision --autogenerate -m "Initial migration"
alembic upgrade head

echo "✅ Backend setup complete!"
echo ""
echo "To run backend:"
echo "  cd backend"
echo "  source venv/bin/activate"
echo "  uvicorn app.main:app --reload"
echo ""

# Frontend setup
cd ../frontend
echo "Setting up frontend..."
npm install

if [ ! -f .env.local ]; then
    cp .env.local.example .env.local
fi

echo "✅ Frontend setup complete!"
echo ""
echo "To run frontend:"
echo "  cd frontend"
echo "  npm run dev"
