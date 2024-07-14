const Category = require("../models/category");
const asyncHandler = require("express-async-handler");

// GET all items
exports.category_list = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: item_list");
});

// GET for one item
exports.category_category = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: individual item info");
});

// GET request for creating a new item
exports.category_create_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: GET create item");
});

// POST request for creating a new item
exports.category_create_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: POST create item");
});

// GET request for deleting an item
exports.category_delete_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Delete GET for item");
});

// POST request for deleting an item
exports.category_delete_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Delete POST for item");
});

// GET request for updating an item
exports.category_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Update GET for item");
});

// post request for updating an item
exports.category_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Update POST for item");
});
