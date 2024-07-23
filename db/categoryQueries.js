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

async function createCategory(vals) {
  try {
    const myQuery = {
      text: `INSERT INTO categories (name, description, image_url) VALUES ($1, $2, $3)`,
      values: vals,
    };

    await pool.query(myQuery);
  } catch (error) {
    console.log(error);
  }
}

// query -> get item by name
async function getCatByName(name) {
  try {
    const myQuery = {
      text: `SELECT categories.id FROM categories WHERE name = $1;`,
      values: [name],
    };

    const { rows } = await pool.query(myQuery);
    return rows;
  } catch (error) {
    console.log(error);
  }
}

async function deleteCat(catID) {
  try {
    const myQuery = {
      text: `DELETE FROM categories WHERE id = $1`,
      values: [catID],
    };

    await pool.query(myQuery);
  } catch (error) {
    console.log(error);
  }
}

async function updateCategory(values) {
  try {
    const myQuery = {
      text: `UPDATE categories SET name = $1, description = $2 WHERE id = $3`,
      values: values,
    };

    await pool.query(myQuery);
  } catch (error) {
    console.log(error);
  }
}

async function updateCategoryImageUpload(values) {
  try {
    const myQuery = {
      text: `UPDATE categories SET name = $1, description = $2, image_url = $4 WHERE id = $3`,
      values: values,
    };

    await pool.query(myQuery);
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  getAllCats,
  getItemsInCategory,
  getCategory,
  createCategory,
  getCatByName,
  deleteCat,
  updateCategory,
  updateCategoryImageUpload,
};
