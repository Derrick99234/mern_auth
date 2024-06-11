import User from "../model/user.model.js";
import bcryptjs from "bcryptjs";
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
