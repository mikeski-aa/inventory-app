const Item = require("../models/item");
const Category = require("../models/category");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const item = require("../models/item");
const cloudinary = require("cloudinary").v2;

// function for checking if session is logged in
function checkSession(req, res) {
  const sessionId = req.cookies.user_session;

  if (!sessionId) {
    res.render("login", {
      title: "Authorized user login",
      error: "You must be logged in to use that functionality",
    });
    return;
  }
}

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
  checkSession(req, res);
  const allCategories = await Category.find({}).exec();

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
  checkSession(req, res);
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
  // delete images when item is deleted
  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
  });

  await cloudinary.uploader
    .destroy(req.params.id, {})
    .then(console.log("image destroyed"))
    .catch((error) => console.log(error));

  await Item.findByIdAndDelete(req.body.itemid);
  res.redirect("/store/items");
});

// GET request for updating an item
exports.item_update_get = asyncHandler(async (req, res, next) => {
  checkSession(req, res);
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

// controller for GET img upload for item
exports.item_image_get = asyncHandler(async (req, res, next) => {
  checkSession(req, res);
  const item = await Item.findById(req.params.id).exec();

  if (item === null) {
    // item not found redirect to items page
    res.redirect("/store/items");
  }

  res.render("item_img_upload", {
    title: "Upload new item image",
    item: item,
  });
});

// controller for POST img upload for item
exports.item_image_post = asyncHandler(async (req, res, next) => {
  const item = await Item.findById(req.params.id).exec();
  const img = req.file;

  // Cloudinary configuration
  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
  });

  if (img === undefined) {
    // user tried submitting without adding a file, re render with error
    res.render("item_img_upload", {
      title: "Upload new item image",
      item: item,
      error: "You must select an image to upload!",
    });
    return;
  }

  // destroy existing file to prevent duplicates
  await cloudinary.uploader
    .destroy(req.params.id, { resource_type: "raw" })
    .catch((error) => console.log(error));

  const response = await cloudinary.uploader
    .upload(req.file.path, { public_id: req.params.id })
    .catch((error) => console.log(error));

  // update item record
  const newItem = new Item({
    name: item.name,
    desc: item.desc,
    price: item.price,
    stock_num: item.stock_num,
    category: item.category,
    _id: item._id,
    image_url: response.url,
  });

  await Item.findByIdAndUpdate(req.params.id, newItem, {});

  res.redirect("/store/" + newItem.url);
});
