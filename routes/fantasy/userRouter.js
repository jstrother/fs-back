import express from "express";
import User from "../../schema/userSchema.js";

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
    console.log('Uh-oh! Something went wrong! Unable to register');
  }
});

userRouter.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).send("User not found");
    }
    if (user.password !== req.body.password) {
      return res.status(403).send("Invalid password");
    }
    res.send("Logged in");
  } catch (error) {
    res.status(400).send(error);
    console.log('Uh-oh! Something went wrong! Unable to login');
  }
});

export default userRouter;