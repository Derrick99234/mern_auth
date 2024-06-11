import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
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

app.listen(3000, () => console.log("Server running on port 3000"));
