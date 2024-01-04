const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const personeSchema = new Schema({
  name: {
    type: String,
    required: [true, "The name filed is required"],
  },
  age: Number,
  favoritFoods: [String],
});

module.exports = persone = mongoose.model("persones", personeSchema);
