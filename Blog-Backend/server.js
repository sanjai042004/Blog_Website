require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
// const multer = require("multer");
const routes = require("./src/routes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://codeverse-beta.vercel.app",
      "my-portfolio-4vqlplbg1-sanjais-projects-6e86220c.vercel.app"
    ],
    credentials: true,
  })
);

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.skbsdwt.mongodb.net/?appName=Cluster0`
    );
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ DB Error:", err.message);
    process.exit(1);
  }
};

// Routes
app.get("/", (_, res) => res.send("Blog Backend Running 🚀"));
app.use("/api", routes);

// // Error Handler
// app.use((err, req, res, next) => {
//   if (err instanceof multer.MulterError)
//     return res.status(400).json({ message: `Upload Error: ${err.message}` });
//   res.status(500).json({ message: "Internal Server Error" });
// });

// Start Server
connectDB().then(() => {
  app.listen(PORT, () =>
    console.log(`🚀 Server running on http://localhost:${PORT}`)
  );
});
