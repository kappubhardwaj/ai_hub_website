const express = require("express");
const mongodb = require("mongodb");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const MongoClient = mongodb.MongoClient;
const mongoURL =
  "mongodb+srv://kapilbhardwaj850:Kapil123@cluster001.s60t45i.mongodb.net/?retryWrites=true&w=majority";
const dbName = "cluster001";
const collectionName = "items";

// Middleware to parse JSON data
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// Create a new item
app.post("/items", async (req, res) => {
  try {
    const client = await MongoClient.connect(mongoURL);
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    console.log(req.body);
    const result = await collection.insertOne(req.body);
    client.close();
    res.status(201).json(result.ops);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred" });
  }
});

// Get all items
app.get("/items", async (req, res) => {
  try {
    const client = await MongoClient.connect(mongoURL);
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    const items = await collection.find().toArray();
    client.close();
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred" });
  }
});

// Get a single item
// app.get("/items/:id", async (req, res) => {
//   try {
//     const client = await MongoClient.connect(mongoURL);
//     const db = client.db(dbName);
//     const collection = db.collection(collectionName);
//     const item = await collection.findOne({
//       _id: new mongodb.ObjectID(req.params.id),
//     });
//     client.close();
//     if (item) {
//       res.json(item);
//     } else {
//       res.status(404).json({ error: "Item not found" });
//     }
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "An error occurred" });
//   }
// });

// Update an item
app.put("/items/:id", async (req, res) => {
  try {
    const client = await MongoClient.connect(mongoURL);
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    const result = await collection.updateOne(
      { _id: new mongodb.ObjectID(req.params.id) },
      { $set: req.body }
    );
    client.close();
    if (result.modifiedCount === 1) {
      res.json({ message: "Item updated successfully" });
    } else {
      res.status(404).json({ error: "Item not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred" });
  }
});

// Delete an item
app.delete("/items/:id", async (req, res) => {
  try {
    const client = await MongoClient.connect(mongoURL);
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    const result = await collection.deleteOne({
      _id: new mongodb.ObjectID(req.params.id),
    });
    client.close();
    if (result.deletedCount === 1) {
      res.json({ message: "Item deleted successfully" });
    } else {
      res.status(404).json({ error: "Item not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred" });
  }
});

// Search for items
app.get("/items/search", async (req, res) => {
  try {
    const client = await MongoClient.connect(mongoURL);
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    let items = await collection.find().toArray();
    items = items.filter((e) =>
      e.name
        .toString()
        .toLowerCase()
        .includes(req.body.name.toString().toLowerCase())
    );
    client.close();
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred" });
  }
});

// Start the server
app.listen(8080, "0.0.0.0", () => {
  console.log("Server is running on port 8080");
});
