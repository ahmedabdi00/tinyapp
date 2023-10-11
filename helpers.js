/* Generates a random string, used for creating short URLs and userIDs */
export const generateRandomString = function () {
  let randomString = "";
  for (let i = 0; i < 6; i++) {
    const randomCharCode = Math.floor(Math.random() * 26 + 97);
    const randomChar = String.fromCharCode(randomCharCode);
    randomString += randomChar;
  }
  return randomString;
};

/* Checks if given email corresponds to a user in a given database, returns true or false */
export const emailHasUser = function (email, userDatabase) {
  for (const user in userDatabase) {
    if (userDatabase[user].email === email) {
      return true;
    }
  }
  return false;
};

/* Takes an email and userDatabase and returns the user ID for the user with the given email address */
export const userIdFromEmail = function (email, userDatabase) {
  for (const user in userDatabase) {
    if (userDatabase[user].email === email) {
      return userDatabase[user].id;
    }
  }
};

/* Returns an object of short URLs specific to the passed in userID */
export const urlsForUser = function (id, urlDatabase) {
  const userUrls = {};
  for (const shortURL in urlDatabase) {
    if (urlDatabase[shortURL].userID === id) {
      userUrls[shortURL] = urlDatabase[shortURL];
    }
  }
  return userUrls;
};

/* Checks if current cookie corresponds with a user in the userDatabase */
export const cookieHasUser = function (cookie, userDatabase) {
  for (const user in userDatabase) {
    if (cookie === user) {
      return true;
    }
  }
  return false;
};
