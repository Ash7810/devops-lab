# Multi-Agent Fitness Website MVP

AI-powered fitness platform with personalized diet and workout plans using Gemini 2.0 Flash, RAG, and multi-agent architecture.

## Features

- 🤖 **AI Chat Interface**: Conversational AI powered by Gemini 2.0 Flash
- 🏋️ **Personalized Workouts**: AI-generated exercise plans based on your goals
- 🥗 **Smart Nutrition Plans**: Customized diet plans with macronutrient breakdown
- 📝 **User Notes & Feedback**: Continuous learning from user experiences
- 📊 **Dashboard**: Daily plans, progress tracking, and insights
- 🔒 **Authentication**: Secure user authentication with JWT

## Tech Stack

### Frontend
- Next.js 14 (React)
- TypeScript
- Tailwind CSS
- Axios for API calls

### Backend
- FastAPI (Python)
- Gemini 2.0 Flash
- ChromaDB (Vector Database for RAG)
- MongoDB (User data and notes)
- JWT Authentication

## Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- Python 3.9+
- MongoDB (local or cloud)
- Gemini API Key

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Set up environment variables:
```bash
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY and other settings
```

5. Start MongoDB (if running locally):
```bash
# MongoDB should be running on localhost:27017
# Or update MONGODB_URL in .env to point to your MongoDB instance
```

6. Run the backend server:
```bash
python main.py
# Or: uvicorn main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`

### Frontend Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

3. Run the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Project Structure

```
multi-agent-fitness-website/
├── backend/
│   ├── agents/
│   │   ├── fitness_agent.py      # Workout planning agent
│   │   ├── nutrition_agent.py    # Diet planning agent
│   │   ├── feedback_agent.py     # Feedback interpretation
│   │   └── orchestrator.py       # Multi-agent coordination
│   ├── routers/
│   │   ├── auth.py               # Authentication endpoints
│   │   ├── users.py              # User management
│   │   ├── chat.py               # AI chat interface
│   │   ├── plans.py              # Daily plans
│   │   └── notes.py              # User notes/feedback
│   ├── services/
│   │   ├── gemini_service.py     # Gemini 2.0 Flash wrapper
│   │   ├── rag_service.py        # RAG with ChromaDB
│   │   └── auth_service.py       # JWT and password hashing
│   ├── models.py                 # Pydantic schemas
│   ├── database.py               # MongoDB connection
│   ├── main.py                   # FastAPI app
│   └── requirements.txt
├── src/
│   └── app/
│       ├── page.tsx              # Home/landing page
│       ├── dashboard/
│       │   └── page.tsx          # Dashboard with chat
│       ├── layout.tsx            # Root layout
│       └── globals.css           # Global styles
├── package.json
├── next.config.js
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Users
- `POST /api/users/profile` - Update user profile

### Chat
- `POST /api/chat` - Send message to AI assistant

### Plans
- `GET /api/plans/daily` - Get today's workout and diet plan

### Notes
- `POST /api/notes` - Save user note/feedback
- `GET /api/notes` - Get user's notes

## Multi-Agent System

The system uses specialized agents:

1. **Fitness Agent**: Generates personalized workout plans
2. **Nutrition Agent**: Creates customized diet plans
3. **Feedback Agent**: Interprets user feedback and extracts insights
4. **Orchestrator**: Coordinates agents and handles chat interactions

## RAG Implementation

- Uses ChromaDB for vector storage
- Sentence transformers for embeddings
- Retrieves relevant context from:
  - Fitness knowledge base
  - Nutrition knowledge base
  - User notes and feedback

## Getting Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add it to `backend/.env` as `GEMINI_API_KEY`

## License

MIT