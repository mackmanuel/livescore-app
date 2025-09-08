const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

// Default route
app.get("/", (req, res) => {
  res.send("✅ Hello World! The server is running.");
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
