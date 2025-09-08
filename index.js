const express = require("express");
const fetch = require("node-fetch");

const app = express();
const PORT = process.env.PORT || 3000;

// serve static files from "public" folder
app.use(express.static("public"));

// API route for live scores
app.get("/livescores", async (req, res) => {
  try {
    const response = await fetch("https://api-football-v1.p.rapidapi.com/v3/fixtures?live=all", {
      method: "GET",
      headers: {
        "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
        "x-rapidapi-key": process.env.RAPIDAPI_KEY
      }
    });

    const data = await response.json();

    // log full API response to Render logs for debugging
    console.log("API response:", JSON.stringify(data, null, 2));

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
