const passport = require("passport");
const session = require("express-session");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../schemas/userSchema");
const jwt = require("jsonwebtoken");

const googleAuth = (app) => {
  app.use(
    session({
      secret: process.env.JWT_SECRET_KEY,
      resave: false,
      saveUninitialized: false,
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser(function (user, done) {
    done(null, user);
  });

  passport.deserializeUser(function (user, done) {
    done(null, user);
  });

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/google/callback",
      },
      async function (accessToken, refreshToken, profile, done) {
        const email = profile.emails[0].value;
        const password = "google";
        try {
          // Check if user already exists in the database
          let user = await User.findOne({ email });

          if (!user) {
            // If user doesn't exist, create a new user
            user = await new User({ email, password }).save();
          }

          const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET_KEY,
            {
              expiresIn: "1h",
            }
          );

          return done(null, { user, token });
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  // Google authentication routes
  app.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
  );

  app.get(
    "/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/login" }),
    function (req, res) {
      res.redirect(
        "http://127.0.0.1:5500/client/src/public/gtml/index.html#/?token=" +
          req.user.token
      );
    }
  );
};
module.exports = googleAuth;
