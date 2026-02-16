# PropVisionAI (Beta)

AI-powered virtual staging for real estate properties. Upload a room photo, select room size, and get an AI-generated modern interior redesign with estimated renovation costs for Thailand.

## Features

- **Image Upload** - Take a photo or upload from gallery with automatic compression
- **Room Size Selection** - Small (<20 sqm), Medium (20-40 sqm), Large (40+ sqm)
- **AI Virtual Staging** - Modern Scandinavian interior design transformation
- **Before/After Slider** - Interactive comparison view
- **Renovation Cost Estimate** - Thailand market pricing (LOW/MID/HIGH tiers)

## Tech Stack

### Frontend
- React 19 + Vite
- Tailwind CSS v4
- React Router
- Lucide Icons

### Backend
- Node.js + Express
- Google Cloud Run ready
- Supabase (database + storage)

### AI Services
- OpenRouter (room analysis)
- Fal.ai (image transformation)

## Getting Started

### Frontend

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

### Backend

```bash
cd backend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
# Edit .env with your API keys

# Start dev server
npm run dev
```

### Environment Variables

**Frontend** (`.env`):
```
VITE_API_URL=http://localhost:8080
```

**Backend** (`backend/.env`):
```
PORT=8080
SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_KEY=your-service-key
OPENROUTER_API_KEY=your-openrouter-key
FAL_API_KEY=your-fal-key
```

## Project Structure

```
PropVisionAI/
├── src/
│   ├── components/       # Reusable UI components
│   ├── context/          # React context (StagingContext)
│   ├── pages/            # Page components
│   ├── services/         # API services
│   └── App.jsx           # Main app with routing
├── backend/
│   ├── src/
│   │   ├── services/     # Business logic
│   │   └── index.js      # Express server
│   ├── Dockerfile        # Cloud Run deployment
│   └── supabase-schema.sql
└── public/
```

## Renovation Cost Model (Thailand - Beta)

| Size | LOW | MID | HIGH |
|------|-----|-----|------|
| S (<20 sqm) | ฿80K | ฿150K | ฿300K |
| M (20-40 sqm) | ฿120K | ฿300K | ฿600K |
| L (40+ sqm) | ฿250K | ฿600K | ฿1.2M |

## Beta Limitations

- Visualization only - not a professional quote
- Cost estimates are approximate
- 3 generations per day limit
- AI may slightly modify non-structural elements

## Deployment

### Frontend (Vercel)
```bash
npm run build
# Deploy dist/ to Vercel
```

### Backend (Google Cloud Run)
```bash
cd backend
gcloud run deploy propvisionai-api --source .
```

## License

MIT
