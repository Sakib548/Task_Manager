const express = require("express");
const jwt = require("jsonwebtoken");
const Task = require("../models/Task");
const User = require("../models/User");

const router = express.Router();

// Middleware for checking authentication
const authenticate = (req, res, next) => {
  const token = req.header("Authorization").replace("Bearer ", "");
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user.id;
    next();
  } catch (error) {
    res.status(401).json({ error: "Unauthorized, Token is not valid" });
  }
};
// Create Task
router.post("/", authenticate, async (req, res) => {
  const { title } = req.body;
  try {
    const task = new Task({ user: req.user, title });
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get Tasks
router.get("/", authenticate, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user });
    res.json(tasks);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update Task
router.patch("/:id", authenticate, async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user },
      req.body,
      { new: true }
    );
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete Task
router.delete("/:id", authenticate, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user,
    });
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
