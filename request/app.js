const express = require("express");
const mongoose = require("mongoose");

// Connect to MongoDB
mongoose
  .connect(
    "mongostat --uri mongodb+srv://kapilbhardwaj850:<PASSWORD>@cluster001.s60t45i.mongodb.net ",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB", err));

// Define a user schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  toolName: String,
  toolDesc: String,
});

// Create a user model
const User = mongoose.model("User", userSchema);

const app = express();
app.use(express.json());

// Create a route to handle user submissions
app.post("/users", async (req, res) => {
  try {
    const { name, email, toolName, toolDesc } = req.body;

    // Create a new user document
    const user = new User({
      name,
      email,
      toolName,
      toolDesc,
    });

    // Save the user to the database
    await user.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to create user" });
  }
});

// Start the server
app.listen(3000, () => {
  console.log("Server started on port 3000");
});
