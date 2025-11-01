if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const session = require("express-session");
const flash = require("connect-flash");
const ejsmate = require("ejs-mate");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const MongoStore = require("connect-mongo");

const ExpressError = require("./utils/expressError");
const User = require("./models/user");

const listingrouter = require("./routes/listingRoute");
const reviewrouter = require("./routes/reviewRoute");
const userrouter = require("./routes/userRoute");

const app = express();

// View engine setup
app.engine("ejs", ejsmate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// MongoDB Connection
const dbUrl = process.env.atlasDB;
async function main() {
  await mongoose.connect(dbUrl);
  console.log("✅ Connected to MongoDB");
}
main().catch((err) => console.log("❌ MongoDB connection error:", err));

// Session store
const secret = process.env.secret || "defaultsecret";
const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: { secret },
  touchAfter: 24 * 3600, // time in seconds
});
store.on("error", (err) => console.log("Session Store Error:", err));

const sessionOptions = {
  store,
  secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  },
};

app.use(session(sessionOptions));
app.use(flash());

// Passport setup
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Flash + current user middleware
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  res.locals.query = req.query.query || "";
  next();
});

// Routes
app.get("/", (req, res) => res.redirect("/listing"));
app.use("/listing", listingrouter);
app.use("/listing/:id/review", reviewrouter);
app.use("/", userrouter);

// 404 Handler
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});

// Error Handler
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("error", { message });
});

// ✅ Azure (or any host) will inject PORT in env
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
