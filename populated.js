#! /usr/bin/env node

console.log("This script populated DB for items and categories collections");

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const Category = require("./models/category");
const Items = require("./models/item");

const categories = [];
const items = [];

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

// main functions runs through creating every model type
async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  console.log("Debug: Should be connected?");
  await createCategories();
  await createItems();
  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}

// We pass the index to the ...Create functions so that, for example,
// genre[0] will always be the Fantasy genre, regardless of the order
// in which the elements of promise.all's argument complete.

async function categoryCreate(index, name, desc) {
  const category = new Category({ name: name, desc: desc });
  await category.save();
  categories[index] = category;
  console.log(`Added category: ${name}`);
}

async function itemCreate(index, name, desc, category, price, stock_num) {
  const itemDetail = {
    name: name,
    desc: desc,
    category: category,
    price: price,
    stock_num: stock_num,
  };

  const item = new Items(itemDetail);
  await item.save();
  items[index] = item;
  console.log(`Added item: ${name} ${desc}`);
}

/// create actual records
async function createCategories() {
  console.log("Adding Categories");
  await Promise.all([
    categoryCreate(0, "Electronics", "Electronic components and computers"),
    categoryCreate(1, "Apparel", "Clothing items and other wearables"),
    categoryCreate(2, "Bikes", "Bicycles and e-bikes"),
    categoryCreate(3, "Tea", "Various tea flavours"),
  ]);
}

async function createItems() {
  console.log("Adding Items");
  await Promise.all([
    itemCreate(
      0,
      "iPad",
      "Overpriced tabled, flex on poor people",
      categories[0],
      "700.00",
      "37"
    ),
    itemCreate(
      1,
      "iPhone XIX",
      "Overpriced phone, much better than an Android",
      categories[0],
      "1359.99",
      "12"
    ),
    itemCreate(
      2,
      "Samsung 4K LED TV",
      "Samsung Crystal UHD CU7172 43 Inch TV (UE43CU7172UXXH, 2023 Model), PurColor, Crystal Processor 4K, Motion Xcelerator, Smart TV [2023]",
      categories[0],
      "342.07",
      "15"
    ),
    itemCreate(
      3,
      "Men's Cargo Shorts",
      "Elegancity Men's Cargo Shorts Summer Casual Trousers Short Elastic Waist Chino Shorts with 6 Pockets S-XXL",
      categories[1],
      "33.99",
      "54"
    ),
    itemCreate(
      4,
      "T-Shirt Women's Crew Neck",
      "WIEIYM T-Shirt Women's Crew Neck Short Sleeve T-Shirts Summer T-Shirts Good Vibes Rainbow Letter Printed Casual Tee Shirts Tops",
      categories[1],
      "17.84",
      "104"
    ),
    itemCreate(
      5,
      "Remington XR01 E Bike",
      "Remington XR01 E Bike Mountain Bike 29 Inch for Men and Women 165-190 cm Ebike 504 Wh Battery Bicycle Electric MTB 18 Speed Pedelec 25 km/h",
      categories[2],
      "1499.00",
      "5"
    ),
    itemCreate(
      6,
      "Bergsteiger Kodiak 26 Inch",
      "Bergsteiger Kodiak 26 Inch, from 150 cm, Disc Brake, Shimano 21 Speed Gears, Full Suspension, Full MTB, Boys' Bicycle & Men's Bicycle",
      categories[2],
      "399.30",
      "2"
    ),
    itemCreate(
      7,
      "Lipton Yellow Label",
      " Lipton Tea Quality No 1 Contents: 100 bags of 1.5 grams. Type: Black Tea",
      categories[3],
      "18.98",
      "17"
    ),
    itemCreate(
      8,
      "Twinings Earl Grey",
      "Black Tea in Tea Bag Refined with Bergamot Aroma - Refreshing Black Tea from China, 200 g",
      categories[3],
      "9.89",
      "26"
    ),
  ]);
}
