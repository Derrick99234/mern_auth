// import express from "express";
import User from "../model/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";
// import cookieParser from "cookie-parser";
// const app = express();
// app.use(cookieParser());
export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  const hashedPassword = bcryptjs.hashSync(password, 10);
  const user = new User({ username, email, password: hashedPassword });
  try {
    await user.save();
    res.status(201).json({
      error: false,
      user,
      message: "User created successfully",
    });
  } catch (e) {
    next(e);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandler(404, "User not found"));
    const isPwdValid = bcryptjs.compareSync(password, validUser.password);
    if (!isPwdValid) return next(errorHandler(401, "Invalid credentials"));

    const token = jwt.sign({ id: validUser._id }, process.env.ACCESS_TOKEN);
    const { password: hashedPassword, ...rest } = validUser._doc;
    // const expiryDate = new Date(Date.now() + 3600000);
    res.cookie("jwt", token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });

    res.status(200).json({
      error: false,
      user: rest,
      token,
      message: "Login is successful",
    });
  } catch (e) {
    next(e);
  }
};

export const google = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN);
      const { password: hashedPassword, ...rest } = user._doc;
      // const expiryDate = new Date(Date.now() + 3600000);
      res.cookie("jwt", token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });

      res.status(200).json({
        error: false,
        user: rest,
        token,
        message: "Login is successful",
      });
    } else {
      const generatedPwd =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPwd, 10);
      const user = new User({
        username:
          req.body.name.split(" ").join("").toLowerCase() +
          Math.floor(Math.random() * 10000).toString(),
        email: req.body.email,
        password: hashedPassword,
        profileIMG: req.body.photo,
      });
      const token = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN, {
        expiresIn: "1h",
      });
      const { password: hashedPwd, ...rest } = user._doc;
      // const expiryDate = new Date(Date.now() + 3600000);
      res.cookie("jwt", token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });

      res.status(200).json({
        error: false,
        user: rest,
        token,
        message: "Login is successful",
      });
    }
  } catch (error) {
    next(error);
  }
};

export const signOut = (req, res) => {
  res
    .clearCookie("access_token")
    .status(200)
    .json({ message: "signOut success" });
};
