const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const { listingSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError");
const listingController = require("../controllers/listings");
const { isLoggedIn, isOwner } = require("../middleware.js");

const multer  = require('multer');
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (["image/png", "image/jpeg"].includes(file.mimetype)) {
            return cb(null, true);
        }
        cb(new ExpressError(400, "Only PNG and JPEG images are allowed."));
    }
});

const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

router.get("/", wrapAsync(listingController.index));
router.post("/", isLoggedIn, upload.single('listing[image]'), validateListing, wrapAsync(listingController.createListing));
router.get("/new", isLoggedIn, listingController.renderNewForm);
router.get("/:id", wrapAsync(listingController.showListing));
router.put("/:id", isLoggedIn, isOwner, upload.single('listing[image]'), validateListing, wrapAsync(listingController.updateListing));
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

module.exports = router;
