// Require dependencies
const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require("method-override");
const Hat = require('./models/hats');
const hatSeed = require('./models/hatSeed')
const bcrypt = require('bcrypt');
const User = require('./models/user');
const expressSession = require('express-session');
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
app.use(express.static('public'))
app.use(express.json()); 
app.use(express.urlencoded({ extended: false }))
app.use(methodOverride("_method"));
app.use(expressSession({
  secret: 'mnvikingssuck', 
  resave: false,
  saveUninitialized: false 
}));

// Seed
app.get("/hats/seed", (req, res) => {
    Hat.deleteMany({}, (error, AllHat) => {})
  
    Hat.create(hatSeed, (error, AllHat) => {
      res.redirect("/hats")
    });
  });
// Index
app.get("/hats", (req, res) => {
  Hat.find({}, (error, AllHat) => {
    res.render("index.ejs", {
      hat: AllHat,
    });
  });
});

// New 
app.get("/hats/new", (req, res) => {
  res.render("new.ejs")
});

// Delete
app.delete("/hats/:id", (req, res) => {
  Hat.findByIdAndDelete(req.params.id, (err, deleteHat) => {
    res.redirect("/hats")
  });
});

// Update
app.put("/hats/:id", (req, res) => {
  Hat.findByIdAndUpdate(
    req.params.id,
    req.body, (error, data) => {
      res.redirect(`/hats/${req.params.id}`)
    }
  )
});
// Create Route
app.post('/hats', (req, res) => {
  Hat.create(req.body, (error, createHat) => {
    res.redirect("/hats")
  });
});
// Edit
app.get("/hats/:id/edit", (req, res) => {
    Hat.findById(req.params.id, (error, foundHat) => {
      res.render("edit.ejs", {
        hat: foundHat
      })
    });
});

// // Show
app.get('/hats/:id', (req, res) => {
    Hat.findById(req.params.id, (err, foundHat) => {
      res.render("show.ejs", {
        hat: foundHat
      });
    });
});

app.get('/', (req, res) => {
  res.render('home.ejs', { user: req.session.user });
});

app.get('/users/delete', async (req, res) => {
  await User.deleteMany({});
  res.redirect('/');
});

app.get('/login', (req, res) => {
  res.render('login.ejs', { error: '' });
});

app.post('/login', (req, res) => {
  User.findOne({ username: req.body.username }, (err, foundUser) => {

      if(!foundUser) {
          return res.render('login.ejs', {error: 'Invalid Credentials'});
      }

      const isMatched = bcrypt.compareSync(req.body.password, foundUser.password);

      if(!isMatched) {
          return res.render('login.ejs', {error: 'Invalid Credentials'});
      }

      req.session.user = foundUser._id;

      res.redirect('/dashboard')
  });
});
app.get('/signup', (req, res) => {
  res.render('signup.ejs');
});
app.post('/signup', (req, res) => {
  req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
 User.create(req.body, (err, user) => {
     req.session.user = user._id
     res.redirect('/dashboard');
 });
});

app.get('/logout', (req, res) => {
  req.session.destroy(() => {
      res.redirect('/');
  });
});
app.get('/dashboard', isAuthenticated, (req, res) => {
  User.findById(req.session.user, (err, user) => {
      res.render('dashboard.ejs', { user });
  });
});

function isAuthenticated(req, res, next) {
  if(!req.session.user) { 
      return res.redirect('/login');
  } 
  next(); 
}
// Tell the App to listen for requests
const PORT = process.env.PORT;
app.listen(PORT, () => { 
    console.log(`Express is listening on port:${PORT}`);
});

