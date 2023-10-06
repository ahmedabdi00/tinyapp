const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const cookieParser = require('cookie-parser');
app.use(cookieParser());


app.set("view engine", "ejs");

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

const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

app.use(express.urlencoded({ extended: true }));

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:id", (req, res) => {
  const id = req.params.id;
  const longURL = urlDatabase[id];
  const templateVars = { id, longURL };
  res.render("urls_show", templateVars);
});

app.get("/urls", (req, res) => {
  const templateVars = {
    username: req.cookies["username"], // Pass the username
    urls: urlDatabase, // Any other variables you want to pass to the view
  };
  res.render("urls_index", templateVars);
});


app.post("/urls", (req, res) => {
  const longURL = req.body.longURL;
  const shortURL = generateRandomString();

  // Save the new URL mapping to the urlDatabase
  urlDatabase[shortURL] = longURL;

  res.redirect(`/urls/${shortURL}`);
});

app.post("/urls/:id/delete", (req, res) => {
  const id = req.params.id;

  // Use JavaScript's delete operator to remove the URL
  delete urlDatabase[id];

  // Redirect the client back to the urls_index page ("/urls")
  res.redirect("/urls");
});

app.post("/urls/:id", (req, res) => {
  const id = req.params.id;
  const newLongURL = req.body.newLongURL; // Assuming you have a form field with name="newLongURL"

  // Update the URL in your urlDatabase
  urlDatabase[id] = newLongURL;

  // Redirect the client back to /urls
  res.redirect("/urls");
});

app.post("/login", (req, res) => {
  const { username } = req.body; // Get the username from the request body
  res.cookie("username", username); // Set the username as a cookie
  res.redirect("/urls"); // Redirect back to the /urls page
});

app.post("/logout", (req, res) => {
  res.clearCookie("username"); // Clear the username cookie
  res.redirect("/urls"); // Redirect back to the /urls page (or any other desired page)
});


app.get("/u/:id", (req, res) => {
  const shortURL = req.params.id;
  const longURL = urlDatabase[shortURL];

  if (longURL) {
    res.redirect(longURL);
  } else {
    // Handle the case where the shortURL is not found
    res.status(404).send("Short URL not found");
  }
});

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.use((req, res, next) => {
  res.locals.partialHeader = "partials/_header";
  next();
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
