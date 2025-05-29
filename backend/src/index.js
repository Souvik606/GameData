import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import axios from 'axios';
import NodeCache from 'node-cache';

const app = express();
const cache = new NodeCache({ stdTTL: 900 }); // 15 minutes TTL

// Middleware
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN }));
app.use(morgan('combined'));
app.use(express.json());

// API-Football Axios instance
const API_KEY = process.env.API_FOOTBALL_KEY;
if (!API_KEY) {
  console.error('❌ API_FOOTBALL_KEY not set in .env');
  process.exit(1);
}

const api = axios.create({
  baseURL: 'https://v3.football.api-sports.io',
  headers: { 'x-apisports-key': API_KEY }
});


// Get all soccer leagues and cache them
app.get('/api/leagues', async (req, res) => {
  const cacheKey = 'leagues';
  const cached = cache.get(cacheKey);
  if (cached) return res.json(cached);

  try {
    const { data } = await api.get('/leagues');
    console.log(data);
    const soccerLeagues = data.response;
    cache.set(cacheKey, soccerLeagues);
    res.json(soccerLeagues);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Failed to fetch leagues' });
  }
});

// Get matches for a specific date or league and cache them
app.get('/api/matches', async (req, res) => {
  const { leagueId, date } = req.query;
  const cacheKey = `matches-${leagueId || 'all'}-${date || 'today'}`;
  const cached = cache.get(cacheKey);
  if (cached) return res.json(cached);

  try {
    const params = {};
    if (leagueId) params.league = leagueId;
    if (date) params.date = date;

    // By default show today's matches
    if (!params.date) {
      const today = new Date().toISOString().split('T')[0];
      params.date = today;
    }

    const { data } = await api.get('/fixtures', { params });
    const matches = data.response.map(fixture => ({
      id: fixture.fixture.id,
      date: fixture.fixture.date,
      venue: fixture.fixture.venue.name,
      league: fixture.league.name,
      leagueLogo: fixture.league.logo,
      country: fixture.league.country,
      homeTeam: {
        name: fixture.teams.home.name,
        logo: fixture.teams.home.logo
      },
      awayTeam: {
        name: fixture.teams.away.name,
        logo: fixture.teams.away.logo
      }
    }));

    cache.set(cacheKey, matches);
    res.json(matches);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Failed to fetch matches' });
  }
});

// Clear cache if wanted
app.get('/api/clear-cache', (req, res) => {
  cache.flushAll();
  res.send('✅ Cache cleared!');
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error('❌ Internal error:', err.message);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start server
const PORT = parseInt(process.env.PORT) || 5000;
app.listen(PORT, () => {
  console.log(`⚽️ Server running at http://localhost:${PORT}`);
});
