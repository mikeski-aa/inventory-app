const Item = require("../models/item");
const asyncHandler = require("express-async-handler");

// display welcome page for store
exports.index = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Home Page");
});

// GET all items
exports.item_list = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: item_list");
});

// GET for one item
exports.item_item = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: individual item info");
});

// GET request for creating a new item
exports.item_create_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: GET create item");
});

// POST request for creating a new item
exports.item_create_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: POST create item");
});

// GET request for deleting an item
exports.item_delete_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Delete GET for item");
});

// POST request for deleting an item
exports.item_delete_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Delete POST for item");
});

// GET request for updating an item
exports.item_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Update GET for item");
});

// post request for updating an item
exports.item_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Update POST for item");
});
