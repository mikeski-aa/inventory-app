const express = require("express");
const router = express.Router();

// Require controller modules
const category_Controller = require("../controllers/categoryController");
const item_controller = require("../controllers/itemController");

// All ITEM ROUTES  ///

// display welcome page for store
router.get("/", item_controller.index);

// GET all items
router.get("/items", item_controller.item_list);

// GET for one item
router.get("/items/:id", item_controller.item_item);

// GET request for creating a new item
router.get("/items/create", item_controller.item_create_get);

// POST request for new item
router.post("/items/create", item_controller.item_create_post);

// GET request to delete an item
router.get("/items/:id/delete", item_controller.item_delete_get);

// POST request to delete an item
router.post("/items/:id/delete", item_controller.item_delete_post);

// GET request to update an item
router.get("/items/:id/update", item_controller.item_update_get);

// POST request to update an item
router.post("/items/:id/update", item_controller.item_update_post);

// ALL CATEGORY ROUTES //

// GET all categories
router.get("/categories", category_Controller.category_list);

// GET specific category
router.get("/categories/:id", category_Controller.category_category);

// GET create new category
router.get("/categories/create", category_Controller.category_create_get);

// POST create new category
router.post("/categories/create", category_Controller.category_create_post);

// GET delete category
router.get("/categories/:id/delete", category_Controller.category_delete_get);

// POST delete category
router.post("/categories/:id/delete", category_Controller.category_delete_post);

// GET update category
router.get("/categories/:id/update", category_Controller.category_update_get);

// POST update category
router.post("/categories/:id/update", category_Controller.category_update_post);

module.exports = router;
