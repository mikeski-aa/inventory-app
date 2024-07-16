const mongoose = require("mongoose");

// define a schema
const Schema = mongoose.Schema;

const CategoryModelSchema = new Schema({
  name: { type: String, required: true, maxLength: 100 },
  desc: { type: String, required: true, maxLength: 100 },
});

// virtual for URL

CategoryModelSchema.virtual("url").get(function () {
  return `/categories/${this._id}`;
});

module.exports = mongoose.model("Category", CategoryModelSchema);
