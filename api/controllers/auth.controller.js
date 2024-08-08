import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { errorhandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const newUser = new User({ username, email, password: hashedPassword });
  try {
    await newUser.save();
    res.status(201).json({ message: "User registered successfully!" });
  } catch (err) {
    next(err);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return next(errorhandler(404, "User not found"));
  }
  const isMatch = bcrypt.compareSync(password, user.password);
  if (!isMatch) {
    return next(errorhandler(401, "Invalid credentials"));
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

  const { password: hashedPassword, ...rest } = user._doc;

  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + 7);

  res
    .cookie("access_token", token, { httpsOnly: true, expires: expiryDate })
    .status(200)
    .json(rest);
  try {
  } catch (err) {
    next(err);
  }
};
