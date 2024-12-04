import express from "express";
import User from "../schema/userSchema.js";

const userRouter = express.Router();

userRouter.post("/register", async (req, res) => {
  try {
    const user = new User({
      _id: new mongoose.Types.ObjectId(),
      email: req.body.email,
      password: req.body.password,
    });
    await user.save();
    res.status(201).send(user);
    alert('registered');
  } catch (error) {
    res.status(400).send(error);
  }
});

export default userRouter;