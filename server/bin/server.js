const express = require("express");
const app = express();
const port = process.env.PORT || 10000;  // ✅ Use Render's provided PORT

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(port, "0.0.0.0", () => {
  console.log(`✅ Server is running on port ${port}`);
});
