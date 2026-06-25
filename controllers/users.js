const User = require("../models/user");

module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup");
};

module.exports.signup = async (req, res, next) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        
        req.login(registeredUser, (err) => {
            if (err) return next(err);
            req.flash("success", "Welcome to WonderPlace!");
            res.redirect("/listings");
        });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login");
};

module.exports.login = async (req, res) => {
    req.flash("success", "Welcome back to WonderPlace!");
    res.redirect("/listings");
};

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        req.flash("success", "You have successfully logged out!");
        res.redirect("/listings");
    });
};

// ... existing imports and functions (signup, login, logout) ...

module.exports.renderWishlist = async (req, res) => {
    // Find the logged-in user and populate their wishlist array with actual Listing data
    const user = await User.findById(req.user._id).populate("wishlist");
    
    // We pass it as 'allListings' so we can easily reuse our index layout logic
    res.render("users/wishlist", { allListings: user.wishlist });
};

module.exports.toggleWishlist = async (req, res) => {
    const { listingId } = req.params;
    const user = await User.findById(req.user._id);

    // 1. Add or Remove from the database
    if (user.wishlist.includes(listingId)) {
        await User.findByIdAndUpdate(req.user._id, { $pull: { wishlist: listingId } });
        req.flash("success", "Removed from Wishlist!");
    } else {
        await User.findByIdAndUpdate(req.user._id, { $addToSet: { wishlist: listingId } });
        req.flash("success", "Added to Wishlist!");
    }
    
    // 2. THE FIX: Safely grab the exact URL the user came from
    const redirectUrl = req.headers.referer || `/listings/${listingId}`;
    
    // 3. Send them exactly where they belong
    res.redirect(redirectUrl); 
};