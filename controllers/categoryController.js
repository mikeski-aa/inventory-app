const cloudinary = require("cloudinary").v2;
const category = require("../models/category");
const Category = require("../models/category");
const Item = require("../models/item");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

// function for checking if session is logged in
// I know this code is the same as in the itemController file. I'm too tired to figuer it out now
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
  checkSession(req, res);
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
  checkSession(req, res);
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
    // delete images when item is deleted
    cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.API_KEY,
      api_secret: process.env.API_SECRET,
    });

    // destroy existing file to prevent duplicates
    await cloudinary.uploader
      .destroy(req.params.id, {})
      .then(console.log("image destroyed"))
      .catch((error) => console.log(error));

    // category has no items, safe to delete
    await Category.findByIdAndDelete(req.body.categoryid);
    res.redirect("/store/categories");
  }

  await Category.findByIdAndDelete(req.params.id).exec();

  res.redirect("/store/categories/");
});

// GET request for updating an category
exports.category_update_get = asyncHandler(async (req, res, next) => {
  checkSession(req, res);
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
  checkSession(req, res);
  const category = await Category.findById(req.params.id).exec();

  if (category === null) {
    // category not found go back to all categories
    res.redirect("/store/categories/");
  }

  res.render("category_img_upload", {
    title: "Upload category image",
    category: category,
  });
});
// post for uploading files
exports.category_image_post = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id).exec();
  const img = req.file;

  // Cloudinary configuration
  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
  });

  if (img === undefined) {
    // submit pressed with no file, re render with error
    res.render("category_img_upload", {
      title: "Upload category image",
      error: "Make sure you have attached a file!",
    });
    return;
  }
  // destroy existing file to prevent duplicates
  await cloudinary.uploader.destroy(req.params.id, { resource_type: "raw" });

  const response = await cloudinary.uploader
    .upload(req.file.path, {
      public_id: req.params.id,
    })
    .catch((error) => {
      console.log(error);
    });

  // update category with new URL
  const newCategory = new Category({
    name: category.name,
    desc: category.desc,
    _id: category.id,
    image_url: response.url,
  });

  await Category.findByIdAndUpdate(req.params.id, newCategory, {});

  res.redirect("/store/" + newCategory.url);
});
