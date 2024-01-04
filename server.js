const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();
const Person = require("./models/person");
const DBUSER = process.env.DBUSER;
const DBPWD = process.env.DBPWD;
app.use(express.json());
mongoose
  .connect(
    `mongodb+srv://${DBUSER}:${DBPWD}@mycluster.gww0avb.mongodb.net/checkpoint-mongoose?retryWrites=true&w=majority`
  )
  .then(() => console.log("connected to database"))
  .catch((err) => console.log(err));

// Post
app.post("/addPerson", async (req, res) => {
  try {
    let { name, age, favoriteFoods } = req.body;
    const newPerson = await new Person({
      name,
      age,
      favoriteFoods,
    });
    await newPerson.save();
    res.status(200).json({ status: true, message: "Data was added" });
  } catch (error) {
    if (error.errors["name"]) {
      res.status(401).json({ status: false, error: error.errors.name.message });
    }
  }
});

// Add
app.put("/addFood/:id", async (req, res) => {
  try {
    let { newFood } = req.body;
    let { id } = req.params;
    let newPerson = await Person.findByIdAndUpdate(
      id,
      {
        $push: { favoriteFoods: newFood },
      },
      { new: true }
    );
    res.status(200).json({ status: true, data: newPerson });
  } catch (error) {
    if (error) throw error;
  }
});
// Get
app.get("/persons", async (req, res) => {
  try {
    let data = await Person.find()
      .sort({ age: "desc" })
      .limit(2)
      .select("-favoriteFoods -name");
    res.status(200).json({ status: true, data });
  } catch (error) {
    if (error) throw error;
  }
});
// Get
app.get("/person", async (req, res) => {
  try {
    let { name } = req.body;
    let nameRegex = new RegExp(name);
    let data = await Person.findOne({ name: nameRegex });
    res.status(200).json({ status: true, data });
  } catch (error) {
    if (error) throw error;
  }
});
app.get("/person/:id", async (req, res) => {
  try {
    let { id } = req.params;
    let data = await Person.findById(id);
    res.status(200).json({ status: true, data });
  } catch (error) {
    if (error) throw error;
  }
});
// Update
app.put("/updatePerson", async (req, res) => {
  try {
    let { username } = req.query;
    let data = await Person.findOneAndUpdate(
      { name },
      {
        $set: {
          ...req.body,
        },
      },
      { new: true }
    );
    res.status(200).json({ status: true, data });
  } catch (error) {
    if (error) throw error;
  }
});
// Delete
app.delete("/deletePerson/:id", async (req, res) => {
  try {
    let { id } = req.params;
    await Person.findByIdAndDelete(id);
    res.status(200).json({ status: true, message: "Person was removed" });
  } catch (error) {
    if (error) throw error;
  }
});

app.listen(5000, (err) => {
  if (err) throw err;
  console.log("server is up and running on port 5000");
});
