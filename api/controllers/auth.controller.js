import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { errorHandler } from "../utils/error.js";
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
    return next(errorHandler(404, "User not found"));
  }
  const isMatch = bcrypt.compareSync(password, user.password);
  if (!isMatch) {
    return next(errorHandler(401, "Invalid credentials"));
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

  const { password: hashedPassword, ...rest } = user._doc;

  const expiryDate = new Date();
  expiryDate.setTime(expiryDate.getTime() + 60 * 60 * 1000); //expires in 1 hour

  res
    .cookie("access_token", token, { httpsOnly: true, expires: expiryDate })
    .status(200)
    .json(rest);
  try {
  } catch (err) {
    next(err);
  }
};

export const google = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const { password: hashedPassword, ...rest } = user._doc;
      const expiryDate = new Date();
      expiryDate.setTime(expiryDate.getTime() + 60 * 60 * 1000);
      res
        .cookie("access_token", token, {
          httpsOnly: true,
          expires: expiryDate,
        })
        .status(200)
        .json(rest);
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcrypt.hashSync(generatedPassword, 10);
      const newUser = new User({
        username:
          req.body.name.split(" ").join("").toLowerCase() +
          Math.floor(Math.random() * 10000).toString(),
        email: req.body.email,
        password: hashedPassword,
        profilePicture: req.body.photo,
      });
      await newUser.save();
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const { password: hashedPassword2, ...rest } = user._doc;
      const expiryDate = new Date();
      expiryDate.setTime(expiryDate.getTime() + 60 * 60 * 1000);
      res
        .cookie("access_token", token, {
          httpsOnly: true,
          expires: expiryDate,
        })
        .status(200)
        .json(rest);
    }
  } catch (err) {
    next(err);
  }
};

export const signout = async (req, res) => {
  res.clearCookie("access_token").status(200).json("Signout success");
};
