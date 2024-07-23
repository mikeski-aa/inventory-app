const pool = require("../db/pool");

// query -> count all items
async function countAllItems() {
  const { rows } = await pool.query("SELECT COUNT(*) AS total FROM items");
  return rows;
}
// query -> count all categories
async function countAllCats() {
  const { rows } = await pool.query("SELECT COUNT(*) AS total FROM categories");
  return rows;
}

// query -> get all items
async function getAllItems() {
  const { rows } = await pool.query("SELECT * FROM items");
  return rows;
}

// query -> get all cats
async function getAllCats() {
  const { rows } = await pool.query("SELECT * FROM categories");
  return rows;
}

module.exports = {
  getAllItems,
  getAllCats,
  countAllCats,
  countAllItems,
};
