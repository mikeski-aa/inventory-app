const mongoose = require("mongoose");

// define a schema
const Schema = mongoose.Schema;

const ItemModelSchema = new Schema({
  name: { type: String, required: true, maxLength: 100 },
  desc: { type: String, required: true, maxLength: 100 },
  category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
  price: { type: Number, required: true },
  stock_num: { type: Number, required: true },
});

// virtual for URL

ItemModelSchema.virtual("url").get(function () {
  return `/item/${this._id}`;
});

const ItemModel = mongoose.model("ItemModel", ItemModelSchema);
