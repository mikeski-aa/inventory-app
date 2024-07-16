const mongoose = require("mongoose");

// define a schema
const Schema = mongoose.Schema;

const ItemModelSchema = new Schema({
  name: { type: String, required: true, maxLength: 100 },
  desc: { type: String, required: true, maxLength: 250 },
  category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
  price: { type: Number, required: true },
  stock_num: { type: Number, required: true },
  image_url: { type: String },
});

// virtual for URL

ItemModelSchema.virtual("url").get(function () {
  return `/items/${this._id}`;
});

module.exports = mongoose.model("Item", ItemModelSchema);
