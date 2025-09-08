const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static("public"));

// --- Mock last 5 matches for teams ---
const lastMatches = {
  "Team Alpha": ["2-1","1-1","0-2","3-0","2-2"],
  "Team Beta":  ["3-0","1-1","1-2","2-0","0-0"],
  "Team Gamma": ["1-1","2-2","0-1","1-0","3-2"],
  "Team Delta": ["0-2","1-3","2-2","1-1","0-0"],
  "Team Epsilon": ["2-0","1-1","0-0","3-1","1-2"],
  "Team Zeta": ["1-0","2-1","1-1","0-2","2-2"],
  "Team Theta": ["3-1","0-2","1-1","2-3","1-0"],
  "Team Sigma": ["0-1","1-2","2-2","1-0","3-0"]
};

// --- Pattern matcher logic ---
function areSimilar(scoreA, scoreB) {
  const highScores = ["3-0","0-3","3-1","1-3","3-3","2-3","3-2",
                      "4-4","3-4","4-3","4-1","1-4","4-0","0-4",
                      "5-1","1-5","5-2","2-5","5-3","3-5","5-5","5-4","4-5",
                      "6-0","0-6","7-0","0-7"];
  const lowSetA = ["0-2","2-0","2-2","2-1","1-2"];
  const lowSetB = ["1-1","1-0","0-1","0-5","5-0","8-0","0-8"];

  if (scoreA === scoreB) return true;
  if (scoreA === "0-0" && highScores.includes(scoreB)) return true;
  if (scoreB === "0-0" && highScores.includes(scoreA)) return true;
  if (lowSetA.includes(scoreA) && lowSetA.includes(scoreB)) return true;
  if (lowSetB.includes(scoreA) && lowSetB.includes(scoreB)) return true;
  return false;
}

function checkPattern(teamA, teamB) {
  const matchesA = lastMatches[teamA] || [];
  const matchesB = lastMatches[teamB] || [];
  for (let a of matchesA) {
    for (let b of matchesB) {
      if (areSimilar(a,b)) {
        return "✅ Pattern Found";
      }
    }
  }
  return "❌ No Pattern";
}

// --- Livescores endpoint with multiple mock matches ---
app.get("/livescores", (req, res) => {
  const now = Date.now();
  const matches = [
    {
      fixture: { date: new Date(now).toISOString(), status: { short: "1H" } },
      teams: { home: { name: "Team Alpha" }, away: { name: "Team Beta" } },
      goals: { home: 1, away: 0 },
      pattern: checkPattern("Team Alpha", "Team Beta")
    },
    {
      fixture: { date: new Date(now + 2*60*60*1000).toISOString(), status: { short: "NS" } },
      teams: { home: { name: "Team Gamma" }, away: { name: "Team Delta" } },
      goals: { home: null, away: null },
      pattern: checkPattern("Team Gamma", "Team Delta")
    },
    {
      fixture: { date: new Date(now).toISOString(), status: { short: "2H" } },
      teams: { home: { name: "Team Epsilon" }, away: { name: "Team Zeta" } },
      goals: { home: 2, away: 1 },
      pattern: checkPattern("Team Epsilon", "Team Zeta")
    },
    {
      fixture: { date: new Date(now + 3*60*60*1000).toISOString(), status: { short: "NS" } },
      teams: { home: { name: "Team Theta" }, away: { name: "Team Sigma" } },
      goals: { home: null, away: null },
      pattern: checkPattern("Team Theta", "Team Sigma")
    }
  ];

  res.json({ response: matches });
});

// Root test
app.get("/", (req, res) => res.send("✅ Hello World! The server is running."));

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
