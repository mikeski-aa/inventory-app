const express = require("express");
const router = express.Router();

// display welcome page for store
router.get("/", function (req, res, next) {
  res.send("This is the homepage!");
});

module.exports = router;
