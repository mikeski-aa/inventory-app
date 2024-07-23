const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

// Require controller modules
const category_Controller = require("../controllers/categoryController");
const item_Controller = require("../controllers/itemController");
const login_Controller = require("../controllers/loginController");

// All ITEM ROUTES  ///

// display welcome page for store
router.get("/", item_Controller.index);

// GET all items
router.get("/items", item_Controller.item_list);

// THIS MUST BE BEFORE ROUTES THAT DISPLAY category ID (use _id)
// GET request for creating a new item
router.get("/items/create", item_Controller.item_create_get);

// POST request for new item
router.post("/items/create", item_Controller.item_create_post);

// GET for one item
router.get("/items/:id", item_Controller.item_detail);

// GET request to delete an item
router.get("/items/:id/delete", item_Controller.item_delete_get);

// POST request to delete an item
router.post("/items/:id/delete", item_Controller.item_delete_post);

// GET request to update an item
router.get("/items/:id/update", item_Controller.item_update_get);

// POST request to update an item
router.post("/items/:id/update", item_Controller.item_update_post);

// GET request to upload item image
router.get("/items/:id/upload-img", item_Controller.item_image_get);

// POST request to upload item image
router.post(
  "/items/:id/upload-img",
  upload.single("image"),
  item_Controller.item_image_post
);

// ALL CATEGORY ROUTES //

// GET all categories
router.get("/categories", category_Controller.category_list);

// GET create new category
router.get("/categories/create", category_Controller.category_create_get);

// POST create new category
router.post("/categories/create", category_Controller.category_create_post);

// GET specific category
router.get("/categories/:id", category_Controller.category_detail);

// GET delete category
router.get("/categories/:id/delete", category_Controller.category_delete_get);

// POST delete category
router.post("/categories/:id/delete", category_Controller.category_delete_post);

// GET update category
router.get("/categories/:id/update", category_Controller.category_update_get);

// POST update category
router.post("/categories/:id/update", category_Controller.category_update_post);

// GET request to upload category image
router.get(
  "/categories/:id/upload-img",
  category_Controller.category_image_get
);
// POST request to upload category image
router.post(
  "/categories/:id/upload-img",
  upload.single("image"),
  category_Controller.category_image_post
);

// LOGIN page

// GET login page
router.get("/login", login_Controller.login_get);

// POST login page
router.post("/login", login_Controller.login_post);

module.exports = router;
