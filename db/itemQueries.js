const pool = require("./pool");

// query -> count all items
async function countAllItems() {
  const { rows } = await pool.query("SELECT COUNT(*) AS total FROM items");
  const test = await pool.query(
    `SELECT items.name, categories.name FROM items JOIN categories ON categories.id = items.category_id;`
  );
  console.log(test);
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

// query -> get specific item
async function getItem(itemId) {
  const myQuery = {
    text: "SELECT * FROM items WHERE id = $1",
    values: [itemId],
  };

  const { rows } = await pool.query(myQuery);
  return rows;
}

module.exports = {
  getAllItems,
  countAllCats,
  countAllItems,
  getItem,
};
