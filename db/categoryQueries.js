const pool = require("./pool");

// get all cats
// query -> get all cats
async function getAllCats() {
  try {
    const { rows } = await pool.query("SELECT * FROM categories");
    return rows;
  } catch (error) {
    console.log(error);
  }
}

// query -> get specific item
async function getItemsInCategory(catID) {
  try {
    const myQuery = {
      text: `SELECT items.id, items.name AS name, items.description, items.price, items.stock_quant, 
        items.category_id, categories.name AS category, categories.image_url
        FROM items JOIN categories ON categories.id = items.category_id
        WHERE categories.id = $1;`,
      values: [catID],
    };

    const { rows } = await pool.query(myQuery);
    return rows;
  } catch (error) {
    console.log(error);
  }
}

async function getCategory(catID) {
  try {
    const myQuery = {
      text: `SELECT *
            FROM categories 
            WHERE categories.id = $1;`,
      values: [catID],
    };

    const { rows } = await pool.query(myQuery);
    return rows;
  } catch (error) {
    console.log(error);
  }
}

async function createCategory() {
  try {
  } catch (error) {
    console.log(error);
  }
}

module.exports = { getAllCats, getItemsInCategory, getCategory };
