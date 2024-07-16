const Category = require("../models/category");
const Item = require("../models/item");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

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
exports.category_create_post = [
  body("name", "Category name is required")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("desc", "Category description is required")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const newCategory = new Category({
      name: req.body.name,
      desc: req.body.desc,
      image_url: "",
    });

    if (!errors.isEmpty()) {
      console.log(errors);
      // errors present, re-render
      res.render("category_form", {
        title: "Create new Category",
        errors: errors.array(),
      });
    } else {
      // valid addition
      await newCategory.save();
      res.redirect("/store/" + newCategory.url);
    }
  }),
];
// GET request for deleting an category
exports.category_delete_get = asyncHandler(async (req, res, next) => {
  const [category, itemsInCategory] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Item.find({ category: req.params.id }).exec(),
  ]);

  res.render("category_delete", {
    title: "Delete a category",
    category: category,
    items: itemsInCategory,
  });
});

// POST request for deleting an category
exports.category_delete_post = asyncHandler(async (req, res, next) => {
  const [category, itemsInCategory] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Item.find({ category: req.params.id }).exec(),
  ]);

  if (itemsInCategory > 0) {
    // items belonging to category detected
    res.render("category_delete", {
      title: "Delete a category",
      category: category,
      items: itemsInCategory,
    });
    return;
  } else {
    // category has no items, safe to delete
    await Category.findByIdAndDelete(req.body.categoryid);
    res.redirect("/store/categories");
  }

  await Category.findByIdAndDelete(req.params.id).exec();

  res.redirect("/store/categories/");
});

// GET request for updating an category
exports.category_update_get = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id).exec();

  if (category === null) {
    // category not found
    const err = new Error("Category not found");
    err.status = 404;
    return next(err);
  }

  res.render("category_form", {
    title: "Update category details",
    category: category,
  });
});

// post request for updating an category
exports.category_update_post = [
  body("name", "Name value is required").trim().isLength({ min: 1 }).escape(),
  body("desc", "Description is required").trim().isLength({ min: 1 }).escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const newCategory = new Category({
      name: req.body.name,
      desc: req.body.desc,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      // errors are present, rerender with error

      res.render("category_form", {
        title: "Update category",
        category: newCategory,
        errors: errors.array(),
      });
      return;
    } else {
      // no errors, validated data
      const newCat = await Category.findByIdAndUpdate(
        req.params.id,
        newCategory,
        {}
      );
      res.redirect("/store" + newCat.url);
    }
  }),
];

// GET for uploading files
exports.category_image_get = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  res.render("category_img_upload", {
    title: "Upload category image",
  });
});
// post for uploading files
exports.category_image_post = asyncHandler(async (req, res, next) => {
  res.send("IMAGE UPLOAD SET NOT IMPLEMENTED");
});
