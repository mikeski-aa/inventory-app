const Category = require("../models/category");
const Item = require("../models/item");
const asyncHandler = require("express-async-handler");

// GET all items
exports.category_list = asyncHandler(async (req, res, next) => {
  const allCategories = await Category.find({}).sort({ name: 1 }).exec();

  res.render("category_list", {
    title: "Category list",
    categories: allCategories,
  });
});

// GET for one category
exports.category_detail = asyncHandler(async (req, res, next) => {
  const [category_found, itemsInCat] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Item.find({ category: req.params.id }).sort("name").exec(),
  ]);

  if (category_found === null) {
    // category not found
    res.redirect("/store/categories");
    return;
  }

  res.render("category_detail", {
    title: "Category details",
    category: category_found,
    items: itemsInCat,
  });
});

// GET request for creating a new category
exports.category_create_get = asyncHandler(async (req, res, next) => {
  res.render("category_form", {
    title: "Create a new Category",
  });
});

// POST request for creating a new category
exports.category_create_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: POST create category");
});

// GET request for deleting an category
exports.category_delete_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Delete GET for category");
});

// POST request for deleting an category
exports.category_delete_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Delete POST for category");
});

// GET request for updating an category
exports.category_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Update GET for category");
});

// post request for updating an category
exports.category_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Update POST for category");
});
