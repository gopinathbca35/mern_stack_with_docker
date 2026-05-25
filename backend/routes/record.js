import express from "express";
import db from "../db/connection.js";
import { ObjectId } from "mongodb";

const router = express.Router();

// Get all records
router.get("/", async (req, res) => {
  try {
    let collection = db.collection("records");
    let results = await collection.find({}).toArray();

    res.status(200).send(results);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching records");
  }
});

// Get single record
router.get("/:id", async (req, res) => {
  try {
    let collection = db.collection("records");

    let query = {
      _id: new ObjectId(req.params.id),
    };

    let result = await collection.findOne(query);

    if (!result) {
      res.status(404).send("Not found");
    } else {
      res.status(200).send(result);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching record");
  }
});

// Create record
router.post("/", async (req, res) => {
  try {
    console.log(req.body);

    let newDocument = {
      name: req.body.name,
      position: req.body.position,
      level: req.body.level,
    };

    let collection = db.collection("records");

    let result = await collection.insertOne(newDocument);

    res.status(201).send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding record");
  }
});

// Update record
router.patch("/:id", async (req, res) => {
  try {
    const query = {
      _id: new ObjectId(req.params.id),
    };

    const updates = {
      $set: {
        name: req.body.name,
        position: req.body.position,
        level: req.body.level,
      },
    };

    let collection = db.collection("records");

    let result = await collection.updateOne(query, updates);

    res.status(200).send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating record");
  }
});

// Delete record
router.delete("/:id", async (req, res) => {
  try {
    const query = {
      _id: new ObjectId(req.params.id),
    };

    let collection = db.collection("records");

    let result = await collection.deleteOne(query);

    res.status(200).send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting record");
  }
});

export default router;