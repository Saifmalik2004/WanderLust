if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require('mongoose');
const path = require("path");
const methodOverride = require("method-override");
const session = require("express-session");

const flash = require("connect-flash");
const ejsmate = require("ejs-mate");

const ExpressError = require("./utils/expressError.js");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingrouter = require("./routes/listingRoute.js");
const reviewrouter = require("./routes/reviewRoute.js");
const userrouter = require("./routes/userRoute.js");
const MongoStore = require("connect-mongo");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsmate);

const dbUrl = process.env.atlasDB;
const mongo = 'mongodb://127.0.0.1:27017/wanderlust';

async function main() {
    await mongoose.connect(dbUrl);
}

main().then(() => {
    console.log("connected to DB");
}).catch((err) => {
    console.log("some error:", err);
});

const secret = process.env.secret;
const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: secret
    },
    touchAfter: 24 * 3600
});

const sessionOptions = {
    store,
    secret: secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
};

store.on("error", (err) => {
    console.log("error in mongo session store", err);
});

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    res.locals.query = req.query.query;
    next();
});

app.use("/listing", listingrouter);
app.use("/listing/:id/review", reviewrouter);
app.use("/", userrouter);

app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not Found!"));
});

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "something went wrong" } = err;
    res.status(statusCode).render("error.ejs", { message });
});

app.listen(8080, () => {
    console.log("server is listening on port 8080");
});
