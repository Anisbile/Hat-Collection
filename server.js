// Require dependencies
const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require("method-override");
const Hat = require('./models/hats');
// Initialize Express App
const app = express();

// Configure App Settings
require('dotenv').config();
const DATABASE_URL = process.env.DATABASE_URL;

// Connect to MongoDB
mongoose.connect(DATABASE_URL);

const db = mongoose.connection;

db.on('connected', () => console.log('Connected to MongoDB'));
db.on('error', (error) => console.log('MongoDB Error ' + error.message));

// Mount Middleware
app.use(express.urlencoded({ extended: false }))
app.use(methodOverride("_method"));

// Seed
app.get("/hats/seed", (req, res) => {
    Hat.deleteMany({}, (error, AllHat) => {})
  
    Hat.create(hatSeed, (error, AllHat) => {
      res.redirect("/hats")
    })
  })
// Index
app.get("/hats", (req, res) => {
  Hat.find({}, (error, AllHat) => {
    res.render("index.ejs", {
      hat: AllHat,
    })
  })
})

// Tell the App to listen for requests
const PORT = process.env.PORT;
app.listen(PORT, () => { 
    console.log(`Express is listening on port:${PORT}`);
});