const Item = require("../models/item");
const Category = require("../models/category");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const item = require("../models/item");

// display welcome page for store
exports.index = asyncHandler(async (req, res, next) => {
  const [numItems, numCategories] = await Promise.all([
    Item.countDocuments({}).exec(),
    Category.countDocuments({}).exec(),
  ]);

  res.render("index", {
    title: "Store home",
    item_total: numItems,
    category_total: numCategories,
  });
});

// GET all items
exports.item_list = asyncHandler(async (req, res, next) => {
  const items = await Item.find({}, "name desc price")
    .sort({ name: 1 })
    .populate("category")
    .exec();

  res.render("item_list", {
    title: "List of all items in inventory",
    items: items,
  });
});

// GET for one item
exports.item_detail = asyncHandler(async (req, res, next) => {
  const item = await Item.findById(req.params.id).populate("category").exec();

  res.render("item_detail", {
    title: "Item details",
    item: item,
  });
});

// GET request for creating a new item
exports.item_create_get = asyncHandler(async (req, res, next) => {
  const [allItems, allCategories] = await Promise.all([
    Item.find({}).exec(),
    Category.find({}).exec(),
  ]);
  res.render("item_form", {
    title: "Create a new item",
    categories: allCategories,
  });
});

// POST request for creating a new item
exports.item_create_post = [
  body("name", "Item name must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("desc", "Item description must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("price", "Item price is required").trim().isNumeric().escape(),
  body("stock_num", "Number of items in stock required")
    .trim()
    .isNumeric()
    .escape(),
  body("category", "You must select one category for this item")
    .trim()
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const newItem = new Item({
      name: req.body.name,
      desc: req.body.desc,
      category: req.body.category,
      price: req.body.price,
      stock_num: req.body.stock_num,
    });

    if (!errors.isEmpty()) {
      const categories = await Category.find().sort({ name: 1 }).exec();
      // errors are present
      res.render("item_form", {
        title: "Add a new item",
        categories: categories,
        errors: errors.array(),
      });
    } else {
      // data is valid, save the new item!
      await newItem.save();
      res.redirect("/store" + newItem.url);
    }
  }),
];

// GET request for deleting an item
exports.item_delete_get = asyncHandler(async (req, res, next) => {
  const item = await Item.findById(req.params.id).exec();

  if (item === null) {
    // item not found, redirect to items page
    res.redirect("/store/items/");
  } else {
    res.render("item_delete", {
      title: "Delete item",
      item: item,
    });
  }
});

// POST request for deleting an item
exports.item_delete_post = asyncHandler(async (req, res, next) => {
  await Item.findByIdAndDelete(req.body.itemid);
  res.redirect("/store/items");
});

// GET request for updating an item
exports.item_update_get = asyncHandler(async (req, res, next) => {
  const [item, allCategories] = await Promise.all([
    Item.findById(req.params.id).populate("category").exec(),
    Category.find({}).exec(),
  ]);

  res.render("item_form", {
    title: "Update item information",
    item: item,
    categories: allCategories,
  });
});

// post request for updating an item
exports.item_update_post = [
  body("name", "Item name required").trim().isLength({ min: 1 }).escape(),
  body("desc", "Description is required").trim().isLength({ min: 1 }).escape(),
  body("price", "Item price is required").trim().escape(),
  body("stock_num", "Number of items in stock is required").trim().escape(),
  body("category", "Category is required").trim().escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const updatedItem = new Item({
      name: req.body.name,
      desc: req.body.desc,
      price: req.body.price,
      stock_num: req.body.stock_num,
      category: req.body.category,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      // re render form if there are errors
      const allCategories = await Category.find({}).sort({ name: 1 }).exec();

      res.render("item_form", {
        title: "Update item",
        item: updatedItem,
        categories: allCategories,
        errors: errors.array(),
      });
      return;
    } else {
      // valid data, let's update record
      const newItem = await Item.findByIdAndUpdate(
        req.params.id,
        updatedItem,
        {}
      );

      res.redirect("/store" + newItem.url);
    }
  }),
];
