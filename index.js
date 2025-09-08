const express = require("express");
const fetch = require("node-fetch");

const app = express();
const PORT = process.env.PORT || 3000;

// serve static files from "public" folder (your index.html lives there)
app.use(express.static("public"));

// API route for live scores
app.get("/livescores", async (req, res) => {
  try {
    const response = await fetch("https://api-football-v1.p.rapidapi.com/v3/fixtures?live=all", {
      method: "GET",
      headers: {
        "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
        "x-rapidapi-key": process.env.RAPIDAPI_KEY // stored securely in Render
      }
    });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("Error fetching live scores:", err.message);
    res.status(500).json({ error: "Failed to fetch live scores" });
  }
});

// start the server
app.listen(PORT, () => {
  console.log(`⚡ Server running at http://localhost:${PORT}`);
});
