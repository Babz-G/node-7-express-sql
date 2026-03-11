// ---------------------------------
// Boilerplate Code to Set Up Server
// ---------------------------------

// importing our Node modules
import express from "express"; // the framework that lets us build a web server
import pg from "pg"; // pg stands for PostgreSQL, for connecting to the database
import config from "./config.js"; // importing our database connection string

// connect to our PostgreSQL database, or db for short
const db = new pg.Pool({
  connectionString: config.databaseUrl, // this contains credentials to access the database. Keep this private!!!
  ssl: true, // use SSL encryption when connecting to the database
});

const app = express(); // creating an instance of the express module

app.use(express.json()); // This server will receive and respond in JSON format

const port = 3000; // Setting which port to listen to to receive requests

//defining our port, then turning on our server to listen for requests
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

// ---------------------------------
// Helper Functions
// ---------------------------------

// 1. getAllAnimals()
async function getAllAnimals() {
  const result = await db.query("SELECT * FROM animals"); // get the data from the database
  console.log(result.rows);
  return result.rows; // we need to return result.rows because rows contains all of the actual data
}

// 2. getOneAnimalByName(name)
async function getOneAnimalByName(name) {
  // db.query() takes in 2 parameters:
  // 1. A String that holds the SQL command
  // 2. An array that holds the values for the placeholders (starting at $1, then $2, $3, and so on)
  const result = await db.query("SELECT * FROM animals WHERE name = $1", [
    name,
  ]);
  return result.rows[0]; // we return the first item in the array
}

// 3. getOneAnimalById(id)
async function getOneAnimalById(id) {
  const result = await db.query("SELECT * FROM animals WHERE id = $1", [id]);
  return result.rows[0];
}

// 4. getNewestAnimal()
async function getNewestAnimal() {
  const result = await db.query(
    "SELECT * FROM animals ORDER BY id DESC LIMIT 1"
  );
  return result.rows[0];
}

// 5. 🌟 BONUS CHALLENGE — getAllMammals()
async function getAllMammals() {
  const result = await db.query(
    "SELECT * FROM animals WHERE category = 'mammal'"
  );
  return result.rows;
}

// 6. 🌟 BONUS CHALLENGE — getAnimalsByCategory(category)
async function getAnimalsByCategory(category) {
  const result = await db.query("SELECT * FROM animals WHERE category = $1", [
    category,
  ]);
  return result.rows;
}

// 7. deleteOneAnimal(id)

// 8. addOneAnimal(name, category, can_fly, lives_in)

// 9. updateOneAnimalName(id, newName)

// 10. updateOneAnimalCategory(id, newCategory)

// 11. 🌟 BONUS CHALLENGE — addManyAnimals(animals)

// ---------------------------------
// API Endpoints
// ---------------------------------

// 1. GET /get-all-animals

app.get("/get-all-animals", async (req, res) => {
  const animals = await getAllAnimals();
  res.json(animals);
});

// 2. GET /get-one-animal-by-name/:name
app.get("/get-one-animal-by-name/:name", async (req, res) => {
  let name = req.params.name;
  const animal = await getOneAnimalByName(name);
  res.json(animal);
});

// 3. GET /get-one-animal-by-id/:id
app.get("/get-one-animal-by-id/:id", async (req, res) => {
  let id = req.params.id;
  const animal = await getOneAnimalById(id);
  res.json(animal);
});

// 4. GET /get-newest-animal
app.get("/get-newest-animal", async (req, res) => {
  const animal = await getNewestAnimal();
  res.json(animal);
});

// 5. 🌟 BONUS CHALLENGE — GET /get-all-mammals
app.get("/get-all-mammals", async (req, res) => {
  const animals = await getAllMammals();
  res.json(animals);
});

// 6. 🌟 BONUS CHALLENGE — GET /get-animals-by-category/:category
app.get("/get-animals-by-category/:category", async (req, res) => {
  const { category } = req.params;
  const animals = await getAnimalsByCategory(category);
  res.json(animals);
});

// 7. POST /delete-one-animal/:id

// 8. POST /add-one-animal

// 9. POST /update-one-animal-name

// 10. POST /update-one-animal-category

// 11. 🌟 BONUS CHALLENGE — POST /add-many-animals
