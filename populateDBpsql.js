const pool = require("./db/pool");
require("dotenv").config();

const createTables = `
CREATE TABLE IF NOT EXISTS items (id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY, 
name VARCHAR (100),
description TEXT, 
category_id INTEGER NOT NULL, 
price FLOAT, 
stock_quant INTEGER,
image_url VARCHAR (255));

CREATE TABLE IF NOT EXISTS categories (id SERIAL PRIMARY KEY, name VARCHAR(100), description TEXT, image_url VARCHAR (255));`;

const populateCategories = `
INSERT INTO categories (name, description, image_url) VALUES ('Electronics', 'Electronic components and computers', '');
INSERT INTO categories (name, description, image_url) VALUES ('Apparel', 'Clothing items and other wearables', '');
INSERT INTO categories (name, description, image_url) VALUES ('Bikes', 'Bicycles and e-bikes', '');
INSERT INTO categories (name, description, image_url) VALUES ('Tea', 'Various tea flavours', '');

`;

const populateItems = `
INSERT INTO items (name, description, category_id, price, stock_quant, image_url) 
VALUES ('iPad',
'Overpriced tabled, flex on poor people',
1,
700.00,
37, '');

INSERT INTO items (name, description, category_id, price, stock_quant, image_url) 
VALUES ('iPhone XIX',
'Overpriced phone, much better than an Android',
1,
1359.99,
12, '');

INSERT INTO items (name, description, category_id, price, stock_quant, image_url) 
VALUES ('Samsung 4K LED TV',
'Samsung Crystal UHD CU7172 43 Inch TV (UE43CU7172UXXH, 2023 Model), PurColor, Crystal Processor 4K, Motion Xcelerator, Smart TV [2023]',
1,
342.07,
15, '');

INSERT INTO items (name, description, category_id, price, stock_quant, image_url) 
VALUES ('Men Cargo Shorts',
'Elegancity Mens Cargo Shorts Summer Casual Trousers Short Elastic Waist Chino Shorts with 6 Pockets S-XXL',
2,
33.99,
54, '');
INSERT INTO items (name, description, category_id, price, stock_quant, image_url) 
VALUES ('T-Shirt Women Crew Neck',
'WIEIYM T-Shirt Women Crew Neck Short Sleeve T-Shirts Summer T-Shirts Good Vibes Rainbow Letter Printed Casual Tee Shirts Tops',
2,
17.84,
104, '');

INSERT INTO items (name, description, category_id, price, stock_quant, image_url) 
VALUES ('Remington XR01 E Bike',
'Remington XR01 E Bike Mountain Bike 29 Inch for Men and Women 165-190 cm Ebike 504 Wh Battery Bicycle Electric MTB 18 Speed Pedelec 25 km/h',
3,
1499.00,
5, '');
INSERT INTO items (name, description, category_id, price, stock_quant, image_url) 
VALUES ('Bergsteiger Kodiak 26 Inch',
'Bergsteiger Kodiak 26 Inch, from 150 cm, Disc Brake, Shimano 21 Speed Gears, Full Suspension, Full MTB, Boys Bicycle & Men Bicycle',
3,
399.30,
2, '');

INSERT INTO items (name, description, category_id, price, stock_quant, image_url) 
VALUES ('Lipton Yellow Label',
' Lipton Tea Quality No 1 Contents: 100 bags of 1.5 grams. Type: Black Tea',
4,
18.98,
17, '');

INSERT INTO items (name, description, category_id, price, stock_quant, image_url) 
VALUES ('Twinings Earl Grey',
'Black Tea in Tea Bag Refined with Bergamot Aroma - Refreshing Black Tea from China, 200 g',
4,
9.89,
26, '');
 `;

async function dbOps(SQL) {
  const client = await pool.connect();
  try {
    await client.query(SQL).then(console.log("DB OP FINISHED"));
  } catch (error) {
    console.log(error);
  } finally {
    client.release();
  }
}

// dbOps(createTables);

// dbOps(populateCategories);
dbOps(populateItems);
