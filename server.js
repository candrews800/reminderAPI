const express = require("express");
const passport = require("passport");
const flash = require("connect-flash");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const session = require("express-session");
const config = require("./config/config");

const PORT = config.serverPort;
const app = express();

// configuration ===============================================================

require("./config/passport")(passport);

// set up our express application
app.use(morgan("combined")); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms

app.set("view engine", "ejs"); // set up ejs for templating

// required for passport
app.use(session({
    secret: config.sessionSecret,
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================
require("./app/routes.js")(app, passport); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
app.listen(PORT);
console.log("Server running on port " + PORT);