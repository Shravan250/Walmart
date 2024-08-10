import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { errorHandler } from "../utils/error.js";

export const test = (req, res) => {
  res.json({ message: "API is working!" });
};

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(errorHandler(401, "You can update only your account!"));
  }

  try {
    if (req.body.password) {
      const hashedPassword = bcrypt.hashSync(req.body.password, 10);
      req.body.password = hashedPassword;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          profilePicture: req.body.profilePicture,
        },
      },
      {
        new: true,
      }
    );
    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (e) {
    next(e);
  }
};

export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(errorHandler(401, "You can delete only your account!"));
  }

  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "User deleted successfully!" });
  } catch (e) {
    next(e);
  }
};
