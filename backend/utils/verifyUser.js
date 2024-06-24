import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
export const verifyToken = (req, res, next) => {
  // const token = req.cookies.access_token;
  const header = req.headers["authorization"];
  if (!header) return res.sendStatus(401);

  const token = header.split(" ")[1];
  if (!token) return res.status(401).json("You need to login");

  jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
    if (err) return res.status(403).json("Token is not valid");
    req.user = user;
    next();
  });
};
