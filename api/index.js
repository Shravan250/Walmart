import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoute from "./routes/user.route.js";

dotenv.config();

const app = express();

mongoose.connect(process.env.MONGO_URI);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.use("/api/user", userRoute);
