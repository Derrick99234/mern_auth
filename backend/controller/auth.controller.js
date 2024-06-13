import User from "../model/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";
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

    const token = jwt.sign({ id: validUser._id }, process.env.ACCESS_TOKEN, {
      expiresIn: "1h",
    });
    const { password: hashedPassword, ...rest } = validUser._doc;
    res.cookie("access_token", token, { httpOnly: true }).status(200).json({
      error: false,
      user: rest,
      message: "Login is successful",
    });
  } catch (e) {
    next(e);
  }
};
