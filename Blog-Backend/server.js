require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const routes = require("./src/routes");

const app = express();
const PORT = process.env.PORT || 5000;


console.log(mongoose.modelNames());


app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://codeverseb.vercel.app",
    ],
    credentials: true,
  })
);

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

app.get("/", (_, res) => res.send("Blog Backend Running 🚀"));
app.use("/api", routes);

connectDB().then(() => {
  app.listen(PORT, () =>
    console.log(`🚀 Server running on http://localhost:${PORT}`)
  );
});
