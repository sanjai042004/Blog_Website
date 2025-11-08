require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const routes = require("./src/routes");
const path = require("path");
const multer = require("multer");

const PORT = 5000;
const app = express();

app.use("/uploads", express.static(path.join(__dirname, "uploads")));


app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: [
    "https://codeverse-b.netlify.app",
    /\.netlify\.app$/  
  ],
  credentials: true,
}));

const mongoOptions = { maxPoolSize: 20, serverSelectionTimeoutMS: 5000, socketTimeoutMS: 45000 };
const connectToMongoDB = async () => {
  try {
    const mongoUri = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.hvunclv.mongodb.net/blogdb?retryWrites=true&w=majority&appName=Cluster0`;
    await mongoose.connect(mongoUri, mongoOptions);
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error.message);
    process.exit(1);
  }
};
app.get("/", (_, res) => res.send("Welcome to TODO backend"));


// Routes
app.use("/api", routes);


app.use((err, req, res, next) => {
  console.error("🔥 Error middleware:", err.message);

  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: `Multer Error: ${err.message}` });
  }

  return res.status(500).json({ message: "Internal Server Error", error: err.message });
});

connectToMongoDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
});

