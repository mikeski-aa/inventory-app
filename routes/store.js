const express = require("express");
const router = express.Router();

// Require controller modules
const category_Controller = require("../controllers/categoryController");
const item_Controller = require("../controllers/itemController");

// All ITEM ROUTES  ///

// display welcome page for store
router.get("/", item_controller.index);

// GET all books
router.get("/items", item_controller.items);

// GET for one book
router.get("/items/:id", item_controller.item);

// GET request for creating a new item
router.get("/items/create", item_controller.create_get);

// POST request for new item
router.post("/items/create", item_controller.create_post);

// GET request to delete an item
router.get("/items/:id/delete", item_controller.delete_get);

// POST request to delete an item
router.post("/items/:id/delete", item_controller.delete_post);

// GET request to update an item
router.get("/items/:id/update", item_controller.update_get);

// POST request to update an item
router.post("/items/:id/update", item_controller.update_post);

// ALL

module.exports = router;
