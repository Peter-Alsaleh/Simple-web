const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// In-memory tasks
let tasks = [
  {
    id: 1,
    title: "Learn Node.js 24",
    completed: false
  },
  {
    id: 2,
    title: "Build my first web application",
    completed: true
  }
];

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Node.js 24 application is running",
    nodeVersion: process.version
  });
});

// Get all tasks
app.get("/api/tasks", (req, res) => {
  res.json(tasks);
});

// Create a task
app.post("/api/tasks", (req, res) => {
  const { title } = req.body;

  if (!title || title.trim() === "") {
    return res.status(400).json({
      message: "Task title is required"
    });
  }

  const task = {
    id: Date.now(),
    title: title.trim(),
    completed: false
  };

  tasks.push(task);

  res.status(201).json(task);
});

// Update task
app.put("/api/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const task = tasks.find((task) => task.id === id);

  if (!task) {
    return res.status(404).json({
      message: "Task not found"
    });
  }

  task.completed = !task.completed;

  res.json(task);
});

// Delete task
app.delete("/api/tasks/:id", (req, res) => {
  const id = Number(req.params.id);

  const taskExists = tasks.some((task) => task.id === id);

  if (!taskExists) {
    return res.status(404).json({
      message: "Task not found"
    });
  }

  tasks = tasks.filter((task) => task.id !== id);

  res.json({
    message: "Task deleted successfully"
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
