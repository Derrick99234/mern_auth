import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRoute from "./routes/user.route.js";
import authRoute from "./routes/auth.route.js";
import cors from "cors";
import cookieParser from "cookie-parser";
dotenv.config();

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connect to mongoose database");
  })
  .catch(() => {
    console.log("Error occur while tryying to  connect to mongoose");
  });
const app = express();

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.listen(3000, () => console.log("Server running on port 3000"));

app.use("/api/user", userRoute);
app.use("/api/auth", authRoute);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";

  return res.status(statusCode).json({
    error: true,
    message,
    statusCode,
  });
});
