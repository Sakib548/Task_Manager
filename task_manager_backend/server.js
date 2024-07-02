const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config();

const app = new express();
app.use(cors());
app.use(express.json());

//connect to mongodb

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

//Define routes

// Import routes
const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/tasks");

// Use routes
app.use("/api/users", authRoutes);
app.use("/api/tasks", taskRoutes);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
