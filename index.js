const express = require("express");
const fetch = require("node-fetch"); // npm install node-fetch@2
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static("public"));

// --- Mock last 5 matches per team for pattern checking ---
const lastMatches = {
  "Team Alpha": ["2-1","1-1","0-2","3-0","2-2"],
  "Team Beta":  ["3-0","1-1","1-2","2-0","0-0"],
  "Team Gamma": ["1-1","2-2","0-1","1-0","3-2"],
  "Team Delta": ["0-2","1-3","2-2","1-1","0-0"],
  "Team Epsilon": ["2-0","1-1","0-0","3-1","1-2"],
  "Team Zeta": ["1-0","2-1","1-1","0-2","2-2"]
};

// --- Pattern matcher logic (hidden from frontend) ---
function areSimilar(scoreA, scoreB) {
  const highScores = ["3-0","0-3","3-1","1-3","3-3","2-3","3-2"];
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

// --- Endpoint: upcoming fixtures ---
app.get("/livescores", async (req, res) => {
  try {
    // --- Replace with real API call when you get a key ---
    // const response = await fetch("REAL_API_URL_HERE", {
    //   method: "GET",
    //   headers: {
    //     "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
    //     "x-rapidapi-key": process.env.API_KEY
    //   }
    // });
    // const data = await response.json();
    // const matches = data.response.map(...);

    // --- Mock upcoming fixtures for now ---
    const now = Date.now();
    const matches = [
      {
        fixture: { date: new Date(now + 2*60*60*1000).toISOString(), status: { short: "NS" } },
        teams: { home: { name: "Team Alpha" }, away: { name: "Team Beta" } },
        goals: { home: null, away: null },
        pattern: checkPattern("Team Alpha", "Team Beta")
      },
      {
        fixture: { date: new Date(now + 4*60*60*1000).toISOString(), status: { short: "NS" } },
        teams: { home: { name: "Team Gamma" }, away: { name: "Team Delta" } },
        goals: { home: null, away: null },
        pattern: checkPattern("Team Gamma", "Team Delta")
      },
      {
        fixture: { date: new Date(now + 6*60*60*1000).toISOString(), status: { short: "NS" } },
        teams: { home: { name: "Team Epsilon" }, away: { name: "Team Zeta" } },
        goals: { home: null, away: null },
        pattern: checkPattern("Team Epsilon", "Team Zeta")
      }
    ];

    res.json({ response: matches });

  } catch (err) {
    console.error(err);
    res.json({ response: [] }); // fallback empty list
  }
});

// Root test
app.get("/", (req, res) => res.send("✅ Hello World! The server is running."));

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
