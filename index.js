import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static("public"));

// ✅ Livescores endpoint with mock data
app.get("/livescores", async (req, res) => {
  try {
    // Mock data with proper ISO dates
    const mockData = {
      response: [
        {
          fixture: {
            date: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1h from now
            status: { short: "NS" } // Not started
          },
          teams: { home: { name: "Team Alpha" }, away: { name: "Team Beta" } },
          goals: { home: null, away: null }
        },
        {
          fixture: {
            date: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(), // 3h from now
            status: { short: "NS" }
          },
          teams: { home: { name: "Team Gamma" }, away: { name: "Team Delta" } },
          goals: { home: null, away: null }
        }
      ]
    };

    res.json(mockData);
  } catch (err) {
    console.error("Error loading mock scores:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Root test
app.get("/", (req, res) => {
  res.send("✅ Hello World! The server is running.");
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
