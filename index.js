import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3000;

// serve files in "public" folder (your index.html lives here)
app.use(express.static("public"));

// API endpoint to get live scores
app.get("/livescores", async (req, res) => {
  try {
    const response = await fetch("https://api-football-v1.p.rapidapi.com/v3/fixtures?live=all", {
      method: "GET",
      headers: {
        "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
        "x-rapidapi-key": process.env.RAPIDAPI_KEY   // 👈 key stays hidden in Render
      }
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching live scores:", error);
    res.status(500).json({ error: "Failed to fetch live scores" });
  }
});

// start server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
