// This file is imported in:
// - /app.js (for user authentication routes)

import express from "express";
import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import User from "../schema/fantasy/userSchema.js";
import { JWT_SECRET } from "../config.js";

const userRouter = express.Router();

userRouter.post("/register", async (req, res) => {
  try {
    const { email, password, username } = req.body;
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });
    if (existingUser) {
      return res.status(400).json("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      email,
      password: hashedPassword,
      username,
    });

    await user.save();

    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ message: 'User created and logged in', token });
  } catch (error) {
    if (error.name === 'ValidationError') {
      // Mongoose validation error
      console.error('Mongoose Validation Error:', error.errors);
      res.status(400).json({ message: 'Validation Error', errors: error.errors });
    } else {
      // Other errors
      console.error('Error during registration:', error);
      res.status(500).json(error);
    }
    console.log('Uh-oh! Something went wrong! Unable to register');
  }
});

userRouter.post("/login", async (req, res) => {
  try {
    const { email, password, username } = req.body;
    const user = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (!user) {
      return res.status(401).json("User not found");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json("Invalid password");
    }

    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
    console.log('logged in');
  } catch (error) {
    res.status(500).json(error);
    console.log('Uh-oh! Something went wrong! Unable to login');
  }
});

export default userRouter;