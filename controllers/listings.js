const Listing = require("../models/listing");
const { uploadBufferToCloudinary } = require("../cloudConfig");

module.exports.index = async (req, res) => {
    const { search, category } = req.query;
    let allListings;

    if (search) {
        allListings = await Listing.find({
            $or: [
                { title: { $regex: search, $options: "i" } },
                { location: { $regex: search, $options: "i" } },
                { country: { $regex: search, $options: "i" } }
            ]
        });
    } else if (category) {
        allListings = await Listing.find({ category: category });
    } else {
        allListings = await Listing.find({});
    }

    res.render("listings/index", { allListings, search, category });
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new");
};

module.exports.showListing = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: { path: "author" }
        })
        .populate("owner"); 
    
    if(!listing) {
        req.flash("error", "Listing does not exist!");
        return res.redirect("/listings");
    }
    res.render("listings/show", { listing });
};

module.exports.createListing = async (req, res, next) => {
    // 1. Geocode using 100% Free OpenStreetMap API
    const locationQuery = req.body.listing.location;
    const geocodeUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationQuery)}`;
    
    let response = await fetch(geocodeUrl, {
        headers: { 'User-Agent': 'WonderPlace_Student_Project/1.0' }
    });
    let data = await response.json();

    let geometry = { type: 'Point', coordinates: [77.2090, 28.6139] }; // Default to Delhi
    if (data && data.length > 0) {
        geometry.coordinates = [parseFloat(data[0].lon), parseFloat(data[0].lat)];
    }

    // 2. IMAGE HANDLING LOGIC (Both File Uploads and Links)
    let url, filename;
    if (typeof req.file !== "undefined") {
        const uploadResult = await uploadBufferToCloudinary(req.file.buffer);
        url = uploadResult.secure_url;
        filename = uploadResult.public_id;
    } else if (req.body.listing.imageUrl) {
        // If they pasted a link, use the link
        url = req.body.listing.imageUrl;
        filename = "linked-image";
    } else {
        // Fallback default image just in case
        url = "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
        filename = "default";
    }

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id; 
    newListing.image = { url, filename };
    newListing.geometry = geometry;
    
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing) {
        req.flash("error", "Listing does not exist!");
        return res.redirect("/listings");
    }
    res.render("listings/edit", { listing });
};

module.exports.updateListing = async (req, res) => {
    const { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if (typeof req.file !== "undefined") {
        const uploadResult = await uploadBufferToCloudinary(req.file.buffer);
        let url = uploadResult.secure_url;
        let filename = uploadResult.public_id;
        listing.image = { url, filename };
        await listing.save();
    }

    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
};
