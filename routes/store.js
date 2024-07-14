const express = require("express");
const router = express.Router();

// Require controller modules
const category_Controller = require("../controllers/categoryController");
const item_Controller = require("../controllers/itemController");

// All ITEM ROUTES  ///

// display welcome page for store
router.get("/", item_Controller.index);

// GET all items
router.get("/items", item_Controller.item_list);

// GET for one item
router.get("/items/:id", item_Controller.item_detail);

// GET request for creating a new item
router.get("/items/create", item_Controller.item_create_get);

// POST request for new item
router.post("/items/create", item_Controller.item_create_post);

// GET request to delete an item
router.get("/items/:id/delete", item_Controller.item_delete_get);

// POST request to delete an item
router.post("/items/:id/delete", item_Controller.item_delete_post);

// GET request to update an item
router.get("/items/:id/update", item_Controller.item_update_get);

// POST request to update an item
router.post("/items/:id/update", item_Controller.item_update_post);

// ALL CATEGORY ROUTES //

// GET all categories
router.get("/categories", category_Controller.category_list);

// GET specific category
router.get("/categories/:id", category_Controller.category_detail);

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
