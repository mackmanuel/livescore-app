const express = require("express");
const fetch = require("node-fetch");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static("public"));

// Livescores route
app.get("/livescores", async (req, res) => {
  try {
    // 1. Try live matches
    let response = await fetch("https://v3.football.api-sports.io/fixtures?live=all", {
      headers: { "x-apisports-key": process.env.API_KEY }
    });
    let data = await response.json();
    let matches = data.response || [];

    // 2. If no live matches, try upcoming
    if (matches.length === 0) {
      response = await fetch("https://v3.football.api-sports.io/fixtures?next=5", {
        headers: { "x-apisports-key": process.env.API_KEY }
      });
      data = await response.json();
      matches = data.response || [];
    }

    // 3. If still nothing, return mock data
    if (matches.length === 0) {
      matches = [
        {
          teams: { home: { name: "Team Alpha" }, away: { name: "Team Beta" } },
          goals: { home: 2, away: 1 }
        },
        {
          teams: { home: { name: "Team Gamma" }, away: { name: "Team Delta" } },
          goals: { home: 0, away: 0 }
        }
      ];
    }

    res.json({ response: matches });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Test route
app.get("/", (req, res) => {
  res.send("✅ Hello World! The server is running.");
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
