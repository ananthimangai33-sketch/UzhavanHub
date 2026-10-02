# UzhavanHub – Smart Farmer Market & Price Discovery Platform

**"Know Your Market. Know Your Price. Sell Smarter."**

A full-stack web application built for the Smart India Hackathon that connects farmers with markets and buyers, providing real-time-style crop price discovery, market comparison, demand alerts, price prediction, weather alerts, quality grading guidance, and direct buyer communication.

---

## Problem Statement

Farmers in Tamil Nadu (and across India) often struggle to:
- Find the right market for their crops
- Get transparent, up-to-date crop prices
- Connect directly with buyers
- Understand market demand
- Make informed selling decisions
- Factor in transportation costs when choosing a market

## Solution

UzhavanHub is a smart digital platform that:
- Provides crop price discovery across multiple Tamil Nadu markets
- Enables side-by-side market comparison with transport cost analysis
- Connects farmers directly with verified buyers
- Offers AI-style price predictions based on historical trends
- Sends demand and weather alerts
- Provides quality grading guidance to help farmers negotiate better prices
- Includes a bilingual (Tamil/English) voice assistant

---

## Features

### Farmer Features
- **Dashboard** – Personalized greeting, price highlights, demand alerts, weather, and listing overview
- **Price Discovery** – Search crops by category, view prices across markets, weekly trend charts
- **Market Comparison** – Compare markets by revenue, transport cost, and net profit
- **Sell Your Crop** – List crops with quantity, price, quality grade, and harvest date
- **My Crops** – Track all crop listings and their status (Active, Buyer Interested, Sold)
- **Find Buyers** – Browse verified buyer cards with crop requirements and offered prices
- **Direct Chat** – Real-time-style chat with accept/reject/counter offer functionality
- **Price Prediction** – AI-style predictions with historical→predicted chart and confidence scores
- **Demand Alerts** – Track crop demand trends with recommended actions
- **Weather Alerts** – Current weather and severity-based alerts (rain, heat, wind)
- **Quality Guide** – Grade A/B/C quality criteria for each crop
- **Nearby Markets** – Market finder with distance, price, hours, and available crops
- **Transport Cost Estimator** – Calculate net revenue after transport costs
- **Profit Calculator** – Full profit breakdown including production, transport, and other expenses
- **Notifications** – Price, buyer, demand, weather, and listing alerts
- **Voice Assistant** – Bilingual (Tamil/English) voice queries with TTS

### Buyer Features
- **Buyer Dashboard** – Overview of listings, requests, and quick actions
- **Search Crops** – Search and filter farmer crop listings
- **Farmer Listings** – Browse all available crop listings in table view
- **My Requests** – Create and manage crop requests with offered prices
- **Chat** – Negotiate directly with farmers

### Admin Features
- **Admin Dashboard** – Platform stats, charts (crop distribution, demand, price trends), recent listings
- **Manage Farmers** – View all registered farmers
- **Manage Buyers** – View and verify buyer accounts
- **Manage Listings** – Oversee all crop listings
- **Market Price Data** – View all market price entries
- **Analytics** – User growth, role distribution, listing trends, price charts

### Demo Mode
A guided 10-step tour for hackathon judges that walks through all major features.

---

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js, TypeScript, Tailwind CSS |
| Routing | React Router DOM |
| Charts | Recharts |
| Icons | Lucide React |
| Backend/Database | Supabase (PostgreSQL) |
| Authentication | Supabase Auth (JWT-based) |
| Voice | Web Speech API (SpeechRecognition + SpeechSynthesis) |

---

## Database Architecture

The application uses Supabase (PostgreSQL) with the following tables:

- **profiles** – User accounts with role (farmer/buyer/admin), name, phone, location
- **farmers** – Farmer-specific data (main crop, farm location)
- **buyers** – Buyer-specific data (business name, verification status, required crops)
- **crops** – Crop catalog with categories
- **crop_listings** – Farmer crop listings with quantity, price, grade, status
- **buyer_requests** – Buyer crop requests with offered prices
- **messages** – Chat messages between users (text, offer, system types)
- **notifications** – User notifications with type and read status
- **market_prices** – Daily market price data per crop per market
- **weather_alerts** – Weather alerts with severity and metrics
- **price_predictions** – Price prediction data with confidence scores

All tables have Row Level Security (RLS) enabled with owner-scoped policies.

---

## API Structure

The frontend communicates with Supabase directly. Key data operations:

- **Auth**: `supabase.auth.signUp()`, `signInWithPassword()`, `signOut()`
- **Profiles**: CRUD on `profiles` table
- **Crop Listings**: CRUD on `crop_listings` table
- **Buyer Requests**: CRUD on `buyer_requests` table
- **Messages**: Insert and select on `messages` table
- **Notifications**: CRUD on `notifications` table
- **Market Prices**: Read from `market_prices` (seeded with demo data)
- **Weather Alerts**: Read from `weather_alerts` (seeded with demo data)
- **Price Predictions**: Read from `price_predictions` (seeded with demo data)

For a production deployment, REST API endpoints would be:
- `POST /api/auth/register`, `POST /api/auth/login`
- `GET /api/crops`, `GET /api/crops/:id`
- `GET /api/prices`, `GET /api/prices/:cropId`, `GET /api/prices/compare`
- `POST /api/listings`, `GET /api/listings`, `PUT /api/listings/:id`
- `GET /api/buyers`, `POST /api/buyers/request`
- `GET /api/messages`, `POST /api/messages`
- `GET /api/weather`, `GET /api/predictions/:cropId`
- `GET /api/notifications`, `PUT /api/notifications/:id/read`

---

## Setup Instructions

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Environment variables**
   The Supabase credentials are pre-populated in `.env`:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

---

## Demo Credentials

Since this uses Supabase Auth with email/password:
1. Visit the Register page and create a farmer or buyer account
2. Use those credentials to log in
3. Or use the Demo Mode from the sidebar for a guided tour

**Demo Data Locations**: Coimbatore, Pollachi, Mettupalayam, Erode, Tiruppur, Salem, Madurai, Chennai

**Demo Crops**: Tomato, Onion, Potato, Paddy, Banana, Coconut, Turmeric, Carrot, Cabbage, Brinjal

---

## Design

- **Color Theme**: Deep Green (#166534), Fresh Green (#22C55E), Earth Brown (#92400E), Golden Yellow (#F59E0B), Sky Blue (#0EA5E9)
- **Background**: #F7FAF5 with white cards
- **Typography**: Inter font family, clean and readable
- **Responsive**: Mobile-first with bottom navigation bar on mobile, sidebar on desktop
- **Components**: Rounded cards, soft shadows, large readable numbers, accessible buttons

---

## Future Improvements

1. **Real-time price API** – Integrate with agricultural market price APIs (e.g., Agmarknet, eNAM)
2. **Weather API** – Connect to OpenWeatherMap or India Meteorological Department API
3. **AI Price Prediction** – Integrate with ML models for accurate price forecasting
4. **Real voice AI** – Connect to Google Speech-to-Text, OpenAI/Gemini for natural language processing
5. **Real-time chat** – Implement Supabase Realtime for live messaging
6. **Map integration** – Google Maps API for nearby market finder
7. **Payment integration** – Add Stripe/Razorpay for direct crop transactions
8. **Multi-language support** – Full i18n for Tamil, Hindi, and other regional languages
9. **Mobile app** – React Native version for Android/iOS
10. **SMS alerts** – Send weather and price alerts via SMS for farmers without smartphones

---

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── DashboardLayout.tsx
│   └── ui.tsx
├── context/             # React contexts
│   ├── AuthContext.tsx
│   └── ToastContext.tsx
├── lib/                 # Utilities and data
│   ├── mockData.ts
│   ├── supabase.ts
│   ├── types.ts
│   └── utils.ts
├── pages/               # All page components
│   ├── AuthPages.tsx
│   ├── LandingPage.tsx
│   ├── FarmerDashboard.tsx
│   ├── PriceDiscovery.tsx
│   ├── CompareMarkets.tsx
│   ├── SellCrop.tsx
│   ├── FindBuyers.tsx
│   ├── ChatPage.tsx
│   ├── MyCrops.tsx
│   ├── PricePrediction.tsx
│   ├── DemandAlerts.tsx
│   ├── WeatherAlerts.tsx
│   ├── QualityGuide.tsx
│   ├── NearbyMarkets.tsx
│   ├── Transport.tsx
│   ├── ProfitCalculator.tsx
│   ├── Notifications.tsx
│   ├── VoiceAssistant.tsx
│   ├── DemoMode.tsx
│   ├── ProfilePage.tsx
│   ├── BuyerPages.tsx
│   └── AdminPages.tsx
├── App.tsx              # Main app with routing
├── main.tsx             # Entry point
└── index.css            # Global styles
```

---

Built for **Smart India Hackathon** · Demo data shown · 2026
