# Setup Guide - Multi-Agent Fitness Website

## Quick Start

### 1. Prerequisites Installation

**Python Setup:**
```bash
# Install Python 3.9+ from python.org
python --version  # Verify installation
```

**Node.js Setup:**
```bash
# Install Node.js 18+ from nodejs.org
node --version  # Verify installation
npm --version
```

**MongoDB Setup:**
```bash
# Option 1: Local MongoDB
# Download from mongodb.com and install
mongod --version

# Option 2: MongoDB Atlas (Cloud - Recommended for MVP)
# Sign up at mongodb.com/atlas
# Create free cluster and get connection string
```

**Gemini API Key:**
1. Go to https://makersuite.google.com/app/apikey
2. Create new API key
3. Copy the key for later use

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env

# Edit .env and add:
# GEMINI_API_KEY=your_api_key_here
# MONGODB_URL=mongodb://localhost:27017  (or your Atlas connection string)
# DATABASE_NAME=fitness_db
# SECRET_KEY=generate-a-random-secret-key-here

# Start MongoDB (if running locally)
# On Windows: net start MongoDB
# On Mac: brew services start mongodb-community
# On Linux: sudo systemctl start mongod

# Run backend server
python main.py
# Server should start at http://localhost:8000
```

### 3. Frontend Setup

```bash
# From project root
npm install

# Create .env.local file
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local

# Start development server
npm run dev
# App should be available at http://localhost:3000
```

### 4. Verify Installation

1. Check backend: Visit http://localhost:8000/health
   - Should return: `{"status": "healthy"}`

2. Check frontend: Visit http://localhost:3000
   - Should see the landing page

3. Test signup:
   - Click "Sign Up" on the homepage
   - Create an account
   - Complete profile setup
   - Should redirect to dashboard

## Troubleshooting

### Backend Issues

**Import Errors:**
```bash
# Make sure virtual environment is activated
# Reinstall dependencies
pip install -r requirements.txt --force-reinstall
```

**MongoDB Connection Error:**
- Verify MongoDB is running
- Check MONGODB_URL in .env file
- For Atlas: Ensure IP is whitelisted

**Gemini API Error:**
- Verify GEMINI_API_KEY is set correctly
- Check API key is valid at makersuite.google.com

### Frontend Issues

**API Connection Error:**
- Verify backend is running on port 8000
- Check NEXT_PUBLIC_API_URL in .env.local
- Check browser console for CORS errors

**Build Errors:**
```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
```

## Production Deployment

### Backend (FastAPI)
- Deploy to: Google Cloud Run, AWS Lambda, or Railway
- Set environment variables in deployment platform
- Use production MongoDB instance

### Frontend (Next.js)
- Deploy to: Vercel (recommended), Netlify, or AWS Amplify
- Update NEXT_PUBLIC_API_URL to production backend URL
- Build command: `npm run build`
- Start command: `npm start`

## Environment Variables Reference

### Backend (.env)
```
GEMINI_API_KEY=required
MONGODB_URL=required
DATABASE_NAME=fitness_db
SECRET_KEY=required (use: python -c "import secrets; print(secrets.token_urlsafe(32))")
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```
