# PropVisionAI (Beta)

AI-powered virtual staging for real estate properties. Upload a room photo, select room size, and get an AI-generated modern interior redesign with estimated renovation costs for Thailand.

## Features

- **Image Upload** - Take a photo or upload from gallery with automatic compression
- **Room Size Selection** - Small (<20 sqm), Medium (20-40 sqm), Large (40+ sqm)
- **AI Virtual Staging** - Modern Scandinavian interior design transformation
- **Staging Style Presets** - Default Premium, Luxury Classic, Modern Luxury
- **Before/After Slider** - Interactive comparison view
- **Renovation Cost Estimate** - Thailand market pricing (LOW/MID/HIGH tiers)
- **Analytics Dashboard** - Track generation time, error rate, cost per day
- **Timeout Protection** - Fallback if AI takes > 20 seconds
- **Conversion Tracking** - Upload, generate, share events

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
- OpenRouter / Claude 3 Haiku (room analysis)
- Fal.ai / Flux (image transformation)

## Getting Started

### Frontend

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Generate icons (optional)
npm run generate-icons
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

# Run API smoke test (safe mode, no real AI image generation)
npm run smoke

# Run full smoke test (includes /api/generate real image generation)
npm run smoke:full
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
ADMIN_API_KEY=your-secret-admin-key
```

## Project Structure

```
PropVisionAI/
├── src/
│   ├── components/       # Reusable UI components
│   ├── context/          # React context (StagingContext)
│   ├── pages/            # Page components
│   │   ├── LandingPage.jsx
│   │   ├── PreviewPage.jsx
│   │   ├── ResultPage.jsx
│   │   └── AdminDashboard.jsx
│   ├── services/         # API services
│   └── App.jsx           # Main app with routing
├── backend/
│   ├── src/
│   │   ├── services/
│   │   │   ├── staging.js    # AI generation logic
│   │   │   ├── quota.js      # User quota management
│   │   │   └── analytics.js  # Event tracking & logging
│   │   └── index.js          # Express server
│   ├── Dockerfile            # Cloud Run deployment
│   └── supabase-schema.sql   # Database schema
├── public/
│   └── icons/            # App icons (SVG + PNG)
└── scripts/
    └── generate-icons.js # Icon generation script
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/generate` | Generate staged image |
| GET | `/api/quota/:userId` | Check user quota |
| POST | `/api/track/upload` | Track upload event |
| POST | `/api/track/share` | Track share event |
| POST | `/api/feedback` | Submit user feedback |
| GET | `/api/admin/stats` | Get dashboard stats (protected) |

`POST /api/generate` accepts optional form field `promptPreset`:
- `default_premium` (default)
- `luxury_classic`
- `modern_luxury`

## Admin Dashboard

Access at `/admin` to view:
- Total generations
- Average generation time
- Error rate
- Daily API costs
- Conversion funnel (Upload → Generate → Success → Share)

Protected by `ADMIN_API_KEY` environment variable.

## Renovation Cost Model (Thailand - Beta)

| Size | LOW | MID | HIGH |
|------|-----|-----|------|
| S (<20 sqm) | ฿80K | ฿150K | ฿300K |
| M (20-40 sqm) | ฿120K | ฿300K | ฿600K |
| L (40+ sqm) | ฿250K | ฿600K | ฿1.2M |

## Timeout Protection

If Fal.ai image generation exceeds 20 seconds:
- Returns fallback placeholder image
- Logs `generate_timeout` event
- User still sees result (with fallback)

## Beta Limitations

- Visualization only - not a professional quote
- Cost estimates are approximate
- 3 generations per day limit
- AI may slightly modify non-structural elements

## Deployment

### Deploy Checklist (Vercel + Cloud Run)

### 1) Pre-deploy checklist
- [ ] Rotate API keys immediately if any real keys were ever committed in `.env` or shared.
- [ ] Confirm backend smoke tests pass:
```bash
cd backend
npm run smoke
npm run smoke:full
```
- [ ] Confirm Supabase schema is applied from `backend/supabase-schema.sql`.

### 2) Deploy backend to Google Cloud Run
- [ ] Set backend environment variables in Cloud Run:
`PORT`, `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, `OPENROUTER_API_KEY`, `FAL_API_KEY`, `ADMIN_API_KEY`
- [ ] Restrict CORS to your frontend domains (Vercel production + preview if needed).
- [ ] Deploy:
```bash
cd backend
gcloud run deploy propvisionai-api --source . --region <your-region> --allow-unauthenticated
```
- [ ] Save your backend URL (example: `https://propvisionai-api-xxxxx-uc.a.run.app`).

### 3) Deploy frontend to Vercel
- [ ] In Vercel project settings, set `VITE_API_URL` to your Cloud Run backend URL.
- [ ] Build and deploy:
```bash
npm run build
```
- [ ] Verify production domain is correct and HTTPS is active.

### 4) Post-deploy verification
- [ ] Health check:
```bash
curl https://<backend-url>/health
```
- [ ] API checks:
`GET /api/quota/:userId`, `POST /api/generate`, `GET /api/admin/stats?key=<ADMIN_API_KEY>`
- [ ] Frontend flow check:
Upload image -> Generate -> Result page -> Admin dashboard
- [ ] Verify Cloud Run logs show no unhandled errors and latency is acceptable.

### 5) Optional hardening
- [ ] Add rate limiting on backend endpoints.
- [ ] Use a stronger auth mechanism for admin dashboard.
- [ ] Set Cloud Run minimum instances to reduce cold starts.
- [ ] Add uptime/alert monitoring for `/health`.

## License

MIT
