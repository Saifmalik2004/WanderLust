const User = require("../models/user.js");


//render form
module.exports.rendersignupform = (req, res) => {
    res.render("users/signup.ejs");
};
//signup
module.exports.signp = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        let registeruser = await User.register(newUser, password);
        console.log(registeruser);
        req.login(registeruser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "welcome to Wanderlust")
            res.redirect("/listing");
        });


    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup")
    }

};
//renderform
module.exports.renderloginform = (req, res) => {
    res.render("users/login.ejs");
};


//login
module.exports.login = async (req, res) => {

    req.flash("success", "welcome  to Wanderlust")
    let redirectUrl = res.locals.redirectUrl || "/listing"

    res.redirect(redirectUrl);



};

//logout
module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "you are logged out")
        res.redirect("/listing");
    })

}