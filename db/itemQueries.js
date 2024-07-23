const pool = require("./pool");

// query -> count all items
async function countAllItems() {
  try {
    const { rows } = await pool.query("SELECT COUNT(*) AS total FROM items");

    return rows;
  } catch (error) {
    console.log(error);
  }
}
// query -> count all categories
async function countAllCats() {
  try {
    const { rows } = await pool.query(
      "SELECT COUNT(*) AS total FROM categories"
    );
    return rows;
  } catch (error) {
    console.log(error);
  }
}

// query -> get all items
async function getAllItems() {
  try {
    const { rows } = await pool.query("SELECT * FROM items");
    return rows;
  } catch (error) {
    console.log(error);
  }
}

// query -> get specific item
async function getItem(itemId) {
  try {
    const myQuery = {
      text: `SELECT items.id, items.name AS name, items.description, items.price, items.stock_quant, 
      items.category_id, categories.name AS category 
      FROM items JOIN categories ON categories.id = items.category_id
      WHERE items.id = $1;`,
      values: [itemId],
    };

    const { rows } = await pool.query(myQuery);
    return rows;
  } catch (error) {
    console.log(error);
  }
}

// query -> save a new item
async function saveItem(vals) {
  try {
    const myQuery = {
      text: `INSERT INTO items (name, description, category_id, price, stock_quant, image_url) 
  VALUES ($1, $2, $3, $4, $5, $6);`,
      values: vals,
    };

    await pool.query(myQuery);
  } catch (error) {
    console.log(error);
  }
}

// query -> get item by name
async function getItemByName(name) {
  try {
    const myQuery = {
      text: `SELECT items.id FROM items WHERE name = $1;`,
      values: [name],
    };

    const { rows } = await pool.query(myQuery);
    return rows;
  } catch (error) {
    console.log(error);
  }
}

// query -> delete an item
async function itemDelete(itemid) {
  try {
    console.log("Check if itemid is loaded correctly");
    console.log(itemid);
    const myQuery = {
      text: `DELETE FROM items WHERE id = $1;`,
      values: [itemid],
    };

    await pool.query(myQuery);
    return;
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  getAllItems,
  countAllCats,
  countAllItems,
  getItem,
  saveItem,
  getItemByName,
  itemDelete,
};
