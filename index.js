const express = require("express");
const fetch = require("node-fetch"); // npm install node-fetch@2
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static("public"));

// --- Pattern matcher (last 5 matches per team) ---
const lastMatches = {
  "Team Alpha": ["2-1","1-1","0-2","3-0","2-2"],
  "Team Beta":  ["3-0","1-1","1-2","2-0","0-0"],
  "Team Gamma": ["1-1","2-2","0-1","1-0","3-2"],
  "Team Delta": ["0-2","1-3","2-2","1-1","0-0"],
  "Team Epsilon": ["2-0","1-1","0-0","3-1","1-2"],
  "Team Zeta": ["1-0","2-1","1-1","0-2","2-2"]
};

// --- Pattern checking logic ---
function areSimilar(scoreA, scoreB) {
  const lowSetA = ["0-2","2-0","2-2","2-1","1-2"];
  const lowSetB = ["1-1","1-0","0-1"];
  if (scoreA === scoreB) return true;
  if (lowSetA.includes(scoreA) && lowSetA.includes(scoreB)) return true;
  if (lowSetB.includes(scoreA) && lowSetB.includes(scoreB)) return true;
  return false;
}

function checkPattern(teamA, teamB) {
  const matchesA = lastMatches[teamA] || [];
  const matchesB = lastMatches[teamB] || [];
  for (let a of matchesA) {
    for (let b of matchesB) {
      if (areSimilar(a,b)) return "✅ Pattern Found";
    }
  }
  return "❌ No Pattern";
}

// --- Endpoint: fetch live fixtures ---
app.get("/livescores", async (req, res) => {
  try {
    if (!process.env.API_KEY) throw new Error("API_KEY not set in environment variables");

    const response = await fetch(
      "https://v3.football.api-sports.io/fixtures?live=all",
      {
        method: "GET",
        headers: {
          "x-rapidapi-host": "v3.football.api-sports.io",
          "x-rapidapi-key": process.env.API_KEY
        }
      }
    );

    const data = await response.json();

    if (!data.response || !data.response.length) {
      return res.json({ response: [] });
    }

    // Map API data to include pattern check
    const fixtures = data.response.map(m => ({
      fixture: { date: m.fixture.date, status: { short: m.fixture.status.short } },
      teams: { home: { name: m.teams.home.name }, away: { name: m.teams.away.name } },
      goals: { home: m.goals.home, away: m.goals.away },
      pattern: checkPattern(m.teams.home.name, m.teams.away.name)
    }));

    res.json({ response: fixtures });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch live fixtures" });
  }
});

// Root
app.get("/", (req, res) => res.send("✅ Server is running."));

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
