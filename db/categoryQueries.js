const pool = require("./pool");

// get all cats
// query -> get all cats
async function getAllCats() {
  const { rows } = await pool.query("SELECT * FROM categories");
  return rows;
}

module.exports = { getAllCats };
