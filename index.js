const express = require("express");
const fetch = require("node-fetch");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static("public"));

// Livescores route
app.get("/livescores", async (req, res) => {
  try {
    let matches = [];

    // --- Try real API first ---
    if (process.env.API_KEY) {
      try {
        let response = await fetch("https://v3.football.api-sports.io/fixtures?live=all", {
          headers: { "x-apisports-key": process.env.API_KEY }
        });
        let data = await response.json();
        matches = data.response || [];

        // If no live matches, try upcoming
        if (matches.length === 0) {
          response = await fetch("https://v3.football.api-sports.io/fixtures?next=5", {
            headers: { "x-apisports-key": process.env.API_KEY }
          });
          data = await response.json();
          matches = data.response || [];
        }
      } catch (apiErr) {
        console.error("API fetch error:", apiErr);
      }
    }

    // --- If still no matches, return mock data ---
    if (matches.length === 0) {
      matches = [
        {
          fixture: {
            date: new Date().toISOString(), // now → LIVE
            status: { short: "1H" } // 1st half
          },
          teams: { home: { name: "Team Alpha" }, away: { name: "Team Beta" } },
          goals: { home: 1, away: 0 }
        },
        {
          fixture: {
            date: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2h from now
            status: { short: "NS" } // not started
          },
          teams: { home: { name: "Team Gamma" }, away: { name: "Team Delta" } },
          goals: { home: null, away: null }
        }
      ];
    }

    res.json({ response: matches });
  } catch (err) {
    console.error("Error in /livescores route:", err);
    res.status(500).json({ error: err.message });
  }
});

// Root test route
app.get("/", (req, res) => {
  res.send("✅ Hello World! The server is running.");
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
