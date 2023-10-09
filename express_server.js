//express_server.js

const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt"); // For password hashing
app.use(cookieParser());

app.set("view engine", "ejs");

// Middleware for parsing POST requests
app.use(express.urlencoded({ extended: true }));

// Function to generate a random string
function generateRandomString() {
  const length = 6; // You can adjust the length as needed
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }
  return result;
}

function findUserByEmail(email) {
  for (const userId in users) {
    if (users[userId].email === email) {
      return users[userId];
    }
  }
  return null; // User not found
}


const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: bcrypt.hashSync("purple-monkey-dinosaur", 10), // Hashed password
  },
  // Add more users as needed
};

const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

// Middleware to check if a user is logged in
app.use((req, res, next) => {
  const userId = req.cookies["user_id"];
  res.locals.user = users[userId];
  next();
});

// Home page
app.get("/", (req, res) => {
  res.send("Hello!");
});

// Registration routes
app.get("/register", (req, res) => {
  // Render the registration form
  res.render("register");
});

app.post("/register", (req, res) => {
  const { email, password } = req.body;
  // Check if the email already exists in users
  for (const userId in users) {
    if (users[userId].email === email) {
      return res.status(400).send("Email already registered");
    }
  }
  // Create a new user and store their data
  const userId = generateRandomString();
  users[userId] = {
    id: userId,
    email: email,
    password: bcrypt.hashSync(password, 10), // Hash the password
  };
  res.cookie("user_id", userId);
  res.redirect("/urls");
});

// Login routes
app.get("/login", (req, res) => {
  // Render the login form
  res.render("login");
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  // Find the user by email using a helper function (e.g., findUserByEmail)
  const user = findUserByEmail(email);

  // Check if the user exists and the password is correct
  if (user && bcrypt.compareSync(password, user.password)) {
    res.cookie("user_id", user.id);
    res.redirect("/urls");
  } else {
    res.status(403).send("Authentication failed: Incorrect email or password");
  }
});


// Logout route
app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/login"); // Redirect to the /login page
});



// URLs routes (example)
app.get("/urls", (req, res) => {
  const templateVars = {
    urls: urlDatabase,
  };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.post("/urls", (req, res) => {
  // Handle URL creation
});

app.get("/urls/:id", (req, res) => {
  // Handle URL details page
});

// Redirect to long URL
app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
  if (longURL) {
    res.redirect(longURL);
  } else {
    res.status(404).send("Short URL not found");
  }
});

// Listen on the specified port
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
