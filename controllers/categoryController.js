const cloudinary = require("cloudinary").v2;
const category = require("../models/category");
const Category = require("../models/category");
const Item = require("../models/item");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const itemQueries = require("../db/itemQueries");
const categoryQueries = require("../db/categoryQueries");

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
  // old mongoose code
  // const allCategories = await Category.find({}).sort({ name: 1 }).exec();

  const allCategories = await categoryQueries.getAllCats();

  res.render("category_list", {
    title: "Category list",
    categories: allCategories,
  });
});

// GET for one category
exports.category_detail = asyncHandler(async (req, res, next) => {
  // old mongoose code
  // const [category_found, itemsInCat] = await Promise.all([
  //   Category.findById(req.params.id).exec(),
  //   Item.find({ category: req.params.id }).sort("name").exec(),
  // ]);

  // new postgres code
  const [category_found, itemsInCat] = await Promise.all([
    categoryQueries.getCategory(req.params.id),
    categoryQueries.getItemsInCategory(req.params.id),
  ]);

  if (category_found === null) {
    // category not found
    res.redirect("/store/categories");
    return;
  }

  res.render("category_detail", {
    title: "Category details",
    category: category_found[0],
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

    // const newCategory = new Category({
    //   name: req.body.name,
    //   desc: req.body.desc,
    //   image_url: "",
    // });

    // only need array for postgres
    const newCategory = [req.body.name, req.body.desc, ""];

    if (!errors.isEmpty()) {
      console.log(errors);
      // errors present, re-render
      res.render("category_form", {
        title: "Create new Category",
        errors: errors.array(),
      });
    } else {
      // valid addition
      // old mongoose code
      // await newCategory.save();

      // new postgres code
      await categoryQueries.createCategory(newCategory);
      const newCat = await categoryQueries.getCatByName(req.body.name);
      res.redirect("/store/categories/" + newCat[0].id);
    }
  }),
];
// GET request for deleting an category
exports.category_delete_get = asyncHandler(async (req, res, next) => {
  checkSession(req, res);
  // old mongoose code
  // const [category, itemsInCategory] = await Promise.all([
  //   Category.findById(req.params.id).exec(),
  //   Item.find({ category: req.params.id }).exec(),
  // ]);

  // new postgres code
  const [category, itemsInCat] = await Promise.all([
    categoryQueries.getCategory(req.params.id),
    categoryQueries.getItemsInCategory(req.params.id),
  ]);

  res.render("category_delete", {
    title: "Delete a category",
    category: category[0],
    items: itemsInCat,
  });
});

// POST request for deleting an category
exports.category_delete_post = asyncHandler(async (req, res, next) => {
  // old mongoose code
  // const [category, itemsInCategory] = await Promise.all([
  //   Category.findById(req.params.id).exec(),
  //   Item.find({ category: req.params.id }).exec(),
  // ]);

  // new postgres code
  const [category, itemsInCat] = await Promise.all([
    categoryQueries.getCategory(req.params.id),
    categoryQueries.getItemsInCategory(req.params.id),
  ]);

  if (itemsInCat.length > 0) {
    // items belonging to category detected
    res.render("category_delete", {
      title: "Delete a category",
      category: category[0],
      items: itemsInCat,
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
    // old mongoose code
    // await Category.findByIdAndDelete(req.body.categoryid);

    await categoryQueries.deleteCat(req.body.categoryid);
    res.redirect("/store/categories");
  }

  await Category.findByIdAndDelete(req.params.id).exec();

  res.redirect("/store/categories/");
});

// GET request for updating an category
exports.category_update_get = asyncHandler(async (req, res, next) => {
  checkSession(req, res);
  // old mongoose code
  // const category = await Category.findById(req.params.id).exec();
  const category = await categoryQueries.getCategory(req.params.id);

  if (category === null) {
    // category not found
    const err = new Error("Category not found");
    err.status = 404;
    return next(err);
  }

  res.render("category_form", {
    title: "Update category details",
    category: category[0],
  });
});

// post request for updating an category
exports.category_update_post = [
  body("name", "Name value is required").trim().isLength({ min: 1 }).escape(),
  body("desc", "Description is required").trim().isLength({ min: 1 }).escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    // required for re-render
    const oldCat = new Category({
      name: req.body.name,
      desc: req.body.desc,
      _id: req.params.id,
    });

    // obj not required for postgres
    const newCategory = [req.body.name, req.body.desc, req.params.id];

    if (!errors.isEmpty()) {
      // errors are present, rerender with error

      res.render("category_form", {
        title: "Update category",
        category: oldCat,
        errors: errors.array(),
      });
      return;
    } else {
      // no errors, validated data
      // old mongoose code
      // const newCat = await Category.findByIdAndUpdate(
      //   req.params.id,
      //   newCategory,
      //   {}
      // );

      // new postgres code
      await categoryQueries.updateCategory(newCategory);
      res.redirect("/store/categories/" + req.params.id);
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
