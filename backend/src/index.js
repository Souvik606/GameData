import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import axios from 'axios';
import NodeCache from 'node-cache';

const app = express();
const cache = new NodeCache({ stdTTL: 900 }); // 15m cache

// Middleware
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN }));
app.use(morgan('combined'));
app.use(express.json());

// API-Football client
const API_KEY = process.env.API_FOOTBALL_KEY;
if (!API_KEY) {
  console.error('❌ API_FOOTBALL_KEY not set');
  process.exit(1);
}
const api = axios.create({
  baseURL: 'https://v3.football.api-sports.io',
  headers: { 'x-apisports-key': API_KEY }
});

// GET /api/leagues
// after
app.get('/api/leagues', async (req, res) => {
  const cacheKey = 'leagues';
  const cached = cache.get(cacheKey);
  if (cached) return res.json(cached);

  try {
    // fetch ALL leagues (no season param)
    const { data } = await api.get('/leagues');

    // flatten to simple league objects
    const leagues = data.response.map(item => ({
      id:   item.league.id,
      name: item.league.name,
      type: item.league.type,
      logo: item.league.logo
    }));

    cache.set(cacheKey, leagues);
    res.json(leagues);

  } catch (err) {
    console.error('League fetch error:', err.message);
    res.status(500).json({ error: 'Failed to fetch leagues' });
  }
});


// GET /api/matches?leagueId=&date=
app.get('/api/matches', async (req, res) => {
  const { leagueId, date } = req.query;
  const cacheKey = `matches-${leagueId || 'all'}-${date || 'today'}`;
  const cached = cache.get(cacheKey);
  if (cached) return res.json(cached);

  try {
    const params = {};
    if (leagueId) params.league = leagueId;
    if (date)        params.date = date;
    else {
      params.date = new Date().toISOString().split('T')[0];
    }

    const { data } = await api.get('/fixtures', { params });
    const matches = data.response.map(f => ({
      id:         f.fixture.id,
      date:       f.fixture.date,
      venue:      f.fixture.venue.name,
      league:     f.league.name,
      leagueLogo: f.league.logo,
      country:    f.league.country,
      homeTeam:   { name: f.teams.home.name, logo: f.teams.home.logo },
      awayTeam:   { name: f.teams.away.name, logo: f.teams.away.logo }
    }));

    cache.set(cacheKey, matches);
    res.json(matches);
  } catch (err) {
    console.error('Matches fetch error:', err.message);
    res.status(500).json({ error: 'Failed to fetch matches' });
  }
});

// clear cache (dev only)
app.get('/api/clear-cache', (_, res) => {
  cache.flushAll();
  res.send('Cache cleared');
});

// 404 & error handlers
app.use((_, res) => res.status(404).json({ error: 'Route not found' }));
app.use((err, _, res, __) => {
  console.error('❌ Internal error:', err.message);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start
const PORT = parseInt(process.env.PORT) || 5000;
app.listen(PORT, () => console.log(`⚽️ Server running at http://localhost:${PORT}`));
