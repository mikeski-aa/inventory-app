const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

// login GET route
exports.login_get = asyncHandler(async (req, res, next) => {
  const sessionId = req.cookies.user_session;

  if (sessionId) {
    res.render("login", { loggedIn: 1, loggedTitle: "Valid login :)" });
  } else {
    res.render("login", {
      title: "Authorized user login",
    });
  }

  res.render("login", {
    title: "Authorized user login",
  });
});

// login POST route
exports.login_post = [
  body("password", "You must enter a password")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    const error = validationResult(req);

    if (!error === null) {
      /// re render login
      res.render("login", {
        title: "Authorized user login",
        error: error,
      });
    } else {
      if (req.body.password === process.env.EDIT_PASS) {
        const sessionId = 5;
        console.log("Correct password entered");
        res.cookie("user_session", sessionId, {
          httpOnly: true,
          secure: true,
          expires: new Date(Date.now() + 60 * 60 * 1000), // Expires in 1 hour
        });
        console.log(res.cookie);
        res.redirect("/");
        return;
      } else {
        /// re render login
        res.render("login", {
          title: "Authorized user login",
          error: error,
        });
      }
    }
  }),
];
