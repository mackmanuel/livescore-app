const express = require("express");
const fetch = require("node-fetch");

const app = express();
const PORT = process.env.PORT || 3000;

// serve static files from "public" folder
app.use(express.static("public"));

// Helper: fetch from API
async function fetchFromAPI(endpoint) {
  const url = `https://api-football-v1.p.rapidapi.com/v3/${endpoint}`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
      "x-rapidapi-key": process.env.RAPIDAPI_KEY
    }
  });
  return response.json();
}

// API route for live scores (with fallback)
app.get("/livescores", async (req, res) => {
  try {
    // 1. Try live matches
    let data = await fetchFromAPI("fixtures?live=all");

    // 2. If no live matches, fallback to upcoming
    if (!data.response || data.response.length === 0) {
      console.log("⚠️ No live matches → fetching upcoming fixtures instead");
      data = await fetchFromAPI("fixtures?next=10");
    }

    res.json(data);
  } catch (err) {
    console.error("Error fetching matches:", err.message);
    res.status(500).json({ error: "Failed to fetch matches" });
  }
});

// start the server
app.listen(PORT, () => {
  console.log(`⚡ Server running at http://localhost:${PORT}`);
});
