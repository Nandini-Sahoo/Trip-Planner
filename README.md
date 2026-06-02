# Trip Planner

A full-stack web application that allows users to generate complete travel itineraries using an AI agent (gemini-2.5-flash). Users provide travel details such as destination, number of days, interests, and budget. The AI agent generates a day-by-day travel plan along with estimated budget and hotel suggestions. Users can also modify the itinerary dynamically.

## Chosen Tech Stack

| Category | Technology | Justification |
|----------|-----------|----------------|
| Frontend | Next.js 14 + Tailwind CSS | Next.js provides server-side rendering and excellent developer experience. Tailwind CSS enables rapid UI development with utility classes. |
| Backend | Node.js + Express | Lightweight, fast, and perfect for building RESTful APIs. JavaScript across full stack maintains consistency. |
| Database | MongoDB Atlas | Flexible document schema works perfectly for dynamic itinerary data. Free tier available for deployment. |
| Language | JavaScript (ES6+) | Chosen over TypeScript for faster development velocity and simpler setup. |

## Setup Instructions

### Prerequisites
- Node.js (v18 or later)
- MongoDB Atlas account (free tier)
- Google AI API key (get from [aistudio.google.com](https://aistudio.google.com/))

### Local Development

1. **Clone the repository**
```bash
git clone https://github.com/Nandini-Sahoo/Trip-Planner.git
cd trip-planner
```

2. **Backend Setup**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and OpenAI API key
npm run dev
```

3. **Frontend Setup** (in a new terminal)
```bash
cd frontend
npm install
cp .env.local.example .env.local
# Edit .env.local with your backend URL
npm run dev
```

4. **Open your browser** at `http://localhost:3000`

### Environment Variables

**Backend (.env)**
```env
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/trip_planner_db
JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=sk-your_geminiai_api_key
```

**Frontend (.env.local)**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Deployed Application
- **Frontend**: [https://your-frontend-url.vercel.app](https://your-frontend-url.vercel.app)
- **Backend**: [https://your-backend-url.onrender.com](https://your-backend-url.onrender.com)

## High-Level Architecture Explanation

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Browser                       │
│                    (Next.js React Application)              │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/REST API
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      Express Backend API                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │ Auth Routes  │  │ Trip Routes  │  │ AI Service   │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
└─────────────────────────────────────────────────────────────┘
                    │                           │
                    ▼                           ▼
            ┌─────────────┐              ┌─────────────┐
            │   MongoDB   │              │ GoogleAI API│
            │   Atlas     │              │  flash-2.5  │
            └─────────────┘              └─────────────┘
```

**Architecture Layers:**
1. **Presentation Layer**: Next.js React components with Tailwind CSS styling
2. **Application Layer**: Express.js route handlers and controllers
3. **Service Layer**: AI service for LLM interactions
4. **Data Layer**: MongoDB models and database operations

## Authentication and Authorization Approach

### Authentication Strategy
- **JWT (JSON Web Tokens)** for stateless authentication
- Passwords hashed using **bcryptjs** (10 salt rounds)
- Token expires after session (no hard expiry for simplicity)

### Authorization Flow
1. User registers/login → Server issues JWT token
2. Token stored in `localStorage` on frontend
3. Every API request includes `Authorization: Bearer <token>`
4. Backend middleware validates token and attaches `userId` to request
5. All trip queries filter by `userId` – **strict data isolation**

### Security Measures
- Passwords never stored in plain text
- Environment variables for sensitive keys
- CORS configured to only allow frontend origin
- No sensitive data logged to console

## AI Agent Design and Purpose

### Design Overview
The AI agent is implemented as a service layer (`aiService.js`) that communicates with GoogleAI's gemini-2.5-flash API. It has three primary functions:

1. **generateTripPlan()** – Creates complete itinerary, budget, and hotel suggestions
2. **regenerateDay()** – Modifies a specific day based on user instruction

### Prompt Engineering Strategy
```javascript
const prompt = `
            Create a detailed ${days}-day travel itinerary for ${destination}.
            Budget: ${budgetType}
            Interests: ${interests.join(", ")}
            IMPORTANT:
            - Each day must be different.
            - Do not repeat activities.
            - Include real attractions, restaurants, and experiences.
            - Activities must be specific to ${destination}.
            Return ONLY valid JSON:
            Provide realistic estimated costs in USD.
              {"itinerary": [
                  {    "day": 1,
                    "activities": ["activity1", "activity2"]
                  }  ],   
                  "budget": {
                    "flights": 500,
                    "accommodation": 300,
                    "food": 150,
                    "activities": 100,
                    "total": 1050
                  },
                "hotels": [
                  {       "name": "Hotel Name",
                          "description": "Description"
                  } ]    } `;
```

### Why This Design?
- **JSON output format** ensures consistent parsing
- **Detailed constraints** prevent hallucinated or malformed responses
- **Fallback responses** handle API failures gracefully
- **Lazy initialization** of OpenAI client prevents startup errors

### Purpose
The AI agent transforms vague user inputs (e.g., "Tokyo, 3 days, medium budget, food & culture") into structured, actionable travel plans – saving users hours of research time.

## Creative/Custom Feature: Personal Notes Per Day

### Feature Description
Users can add **personal notes** to each day of their itinerary. These notes are saved to the database and persist across sessions.

### Screenshot / Code Snippet
```jsx
<div className="mt-3 border-t pt-2">
  <label className="block text-sm font-semibold text-maroon">
    Personal Notes:
  </label>
  <textarea 
    value={day.notes || ''} 
    onChange={(e) => handleNotesChange(idx, e.target.value)} 
    className="w-full border rounded p-1 text-sm" 
    rows="2" 
    placeholder="Add your own notes, reminders, or packing tips..." />
</div>
```

### Why I Built This Feature
Users often need to add **private information** that the AI cannot know:
- Packing reminders ("bring umbrella")
- Personal contacts ("meet John at 5pm")
- Local tips from friends
- Expense tracking notes

### Problem It Solves
AI-generated itineraries are **static and generic**. This feature bridges the gap between AI automation and human personalization – users keep the AI's structure while adding their own flavor.

### Engineering Judgment
- Notes are stored **directly in the itinerary array** (not a separate collection) for simplicity
- No character limits initially (can be added later)
- Real-time saving via the existing update endpoint

## Key Design Decisions and Trade-offs

| Decision | Trade-off | Why Made |
|----------|-----------|----------|
| **JavaScript over TypeScript** | Less type safety | Faster development, simpler setup |
| **MongoDB over PostgreSQL** | Less relational integrity | Flexible itinerary schema changes frequently |
| **JWT over sessions** | No logout from all devices | Stateless, easier to scale |
| **GoogleAI gemini-2.5-flash over GPT-4** | Less accurate responses | Lower cost, faster response times |
| **Single root .gitignore** | Less granular control | Simpler maintenance |
| **AI fallback responses** | Less intelligent if API fails | Graceful degradation |

### Why MongoDB Schema Works
```javascript
const tripSchema = {
  itinerary: [{ day, activities, notes }], // Nested flexible structure
  budget: { flights, accommodation, food, activities, total },
  hotels: [{ name, description }]
}
```
- **No fixed schema** for activities count per day
- **Easy to add fields** like `notes` later
- **Embedded documents** reduce database queries

## Known Limitations

1. **OpenAI API Dependency**
   - Requires valid API key with credits
   - Rate limits may apply
   - ~5-10 second response time

2. **No Real-time Collaboration**
   - Users cannot share trips with others
   - No simultaneous editing

3. **Basic Error Handling**
   - Network failures show generic alerts
   - No retry logic for failed API calls

4. **No Pagination**
   - Dashboard shows all trips at once
   - May slow with 50+ trips

5. **Budget Estimation Accuracy**
   - Based on generic travel costs, not real-time pricing
   - Currency defaults to USD

6. **Mobile Responsiveness**
   - Works on mobile but not fully optimized
   - Complex itinerary tables may overflow

## Future Improvements

- [ ] Add Google Maps integration for activity locations
- [ ] Implement trip sharing with read-only links
- [ ] Add PDF export for itineraries
- [ ] Real-time flight/hotel price APIs
- [ ] User profile with preferences
- [ ] Dark mode support
- [ ] PWA for offline access

## Deployment

### Backend (Render)
1. Push code to GitHub
2. Create Web Service on Render
3. Add environment variables
4. Auto-deploys on push

### Frontend (Vercel)
1. Import GitHub repository
2. Add `NEXT_PUBLIC_API_URL` environment variable
3. Automatic deployments on main branch

## License

License - Free for educational and personal use.

## Acknowledgements

- GoogleAI for gemini-2.5-flash API
- Next.js team for the React framework
- MongoDB for free Atlas tier
- Tailwind CSS for utility-first styling
