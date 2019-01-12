const knex = require("../config/knex");
const crypto = require("crypto");

// load all the things we need
var LocalStrategy = require("passport-local").Strategy;

// expose this function to our app using module.exports
module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        knex.table("users").where("id", id).first()
            .then(function(user) {
                console.log(user);
                done(null, user);
            });
    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called "local"

    passport.use("local-signup", new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : "email",
            passwordField : "password",
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        async function(req, email, password, done) {
            const exists = await knex("users").where("email", email).first();

            if (exists) {
                return done(null, false, req.flash("signupMessage", "That email is already taken."));
            }

            const pw = saltHashPassword(password);
            console.log(pw);
            const user = {
                email: email,
                hash: pw.passwordHash,
                salt: pw.salt,
                updated_at: new Date(),
                created_at: new Date()
            };

            const result = await knex("users").insert(user).returning("*");

            return done(null, result[0]);

        }));

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called "local"

    passport.use("local-login", new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : "email",
            passwordField : "password",
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        async function(req, email, password, done) { // callback with email and password from our form

            const user = await knex("users").where("email", email).first();
            console.log(user);

            if (!user) {
                return done(null, false, req.flash("loginMessage", "No user found.")); // req.flash is the way to set flashdata using connect-flash
            }

            const pw = sha512(password, user.salt);

            if (user.hash !== pw.passwordHash) {
                return done(null, false, req.flash("loginMessage", "Oops! Wrong password.")); // create the loginMessage and save it to session as flashdata
            }

            return done(null, user);
        }));

};

/**
 * generates random string of characters i.e salt
 * @function
 * @param {number} length - Length of the random string.
 */
const genRandomString = function(length){
    return crypto.randomBytes(Math.ceil(length/2))
        .toString("hex") /** convert to hexadecimal format */
        .slice(0,length);   /** return required number of characters */
};

/**
 * hash password with sha512.
 * @function
 * @param {string} password - List of required fields.
 * @param {string} salt - Data to be validated.
 */
const sha512 = function(password, salt){
    const hash = crypto.createHmac("sha512", salt); /** Hashing algorithm sha512 */
    hash.update(password);
    const value = hash.digest("hex");
    return {
        salt: salt,
        passwordHash: value
    };
};

function saltHashPassword(userpassword) {
    const salt = genRandomString(16); /** Gives us salt of length 16 */
    return sha512(userpassword, salt);
}