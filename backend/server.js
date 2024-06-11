import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRoute from "./routes/user.route.js";
import authRoute from "./routes/auth.route.js";
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

app.use(express.json());

app.listen(3000, () => console.log("Server running on port 3000"));

app.use("/api/user", userRoute);
app.use("/api/auth", authRoute);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";

  return res.status(statusCode).json({
    error: false,
    message,
    statusCode,
  });
});
