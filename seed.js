const mongoose = require("mongoose");
const Listing = require("./models/listing");

const MONGO_URL = "mongodb://127.0.0.1:27017/wonderplace";

main().then(() => console.log("Connected to MongoDB for Seeding")).catch(err => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

const seedListings = [
    {
        title: "Luxury Glass Villa in the Hills",
        description: "Experience nature like never before in this stunning glass-front villa. Wake up to panoramic views of the snow-capped mountains right from your bed. Features a private heated infinity pool.",
        image: { url: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80", filename: "seed" },
        price: 8500,
        location: "Manali",
        country: "India",
        category: "Mountain",
        geometry: { type: "Point", coordinates: [77.1887, 32.2396] }
    },
    {
        title: "Cozy Beachfront Resort Cottage",
        description: "Wake up to the sound of crashing waves in this beautiful seaside retreat. Step directly out of your living room and onto the pristine white sands. Perfect for a romantic getaway.",
        image: { url: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80", filename: "seed" },
        price: 5200,
        location: "Goa",
        country: "India",
        category: "Beach",
        geometry: { type: "Point", coordinates: [73.8567, 15.2993] }
    },
    {
        title: "Modern Minimalist Penthouse",
        description: "Right in the heart of the bustling city. Walking distance to all major attractions, fine dining, and shopping. Enjoy sunset views from the 40th-floor private balcony.",
        image: { url: "https://plus.unsplash.com/premium_photo-1661913412680-c274b6fea096?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cGVudGhvdXNlfGVufDB8fDB8fHww", filename: "seed" },
        price: 6500,
        location: "Mumbai",
        country: "India",
        category: "Apartment",
        geometry: { type: "Point", coordinates: [72.8777, 19.0760] }
    },
    {
        title: "Forest Canopy Luxury Tent",
        description: "Disconnect from the world and stargaze in our luxury camping site. Includes plush bedding, outdoor fire pit, and guided morning yoga sessions by the river.",
        image: { url: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80", filename: "seed" },
        price: 2500,
        location: "Rishikesh",
        country: "India",
        category: "Camping",
        geometry: { type: "Point", coordinates: [78.2676, 30.0869] }
    },
    {
        title: "Heritage Palace Suite",
        description: "Live like royalty in this restored 18th-century palace suite. Featuring traditional Rajasthani architecture, marble floors, and a dedicated butler service.",
        image: { url: "https://images.unsplash.com/photo-1582610116397-edb318620f90?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80", filename: "seed" },
        price: 15000,
        location: "Jaipur",
        country: "India",
        category: "Luxury",
        geometry: { type: "Point", coordinates: [75.7873, 26.9124] }
    },
    {
        title: "Private Pool Villa Oasis",
        description: "A secluded sanctuary featuring a massive private pool surrounded by lush tropical gardens. Perfect for families or large groups looking for total privacy.",
        image: { url: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80", filename: "seed" },
        price: 11000,
        location: "Udaipur",
        country: "India",
        category: "Villa",
        geometry: { type: "Point", coordinates: [73.6828, 24.5854] }
    },
    {
        title: "Backpacker's Mountain Hostel",
        description: "A vibrant, colorful space for solo travelers and budget backpackers. Includes high-speed WiFi, communal kitchen, and nightly acoustic bonfire jams.",
        image: { url: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80", filename: "seed" },
        price: 800,
        location: "Kasol",
        country: "India",
        category: "Budget",
        geometry: { type: "Point", coordinates: [77.3200, 32.0100] }
    },
    {
        title: "Tropical Treehouse Retreat",
        description: "Suspended 40 feet in the air amidst the dense jungles. Wake up to the sounds of exotic birds and enjoy your morning coffee on the wooden wrap-around deck.",
        image: { url: "https://images.unsplash.com/photo-1587061949409-02df41d5e562?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80", filename: "seed" },
        price: 4800,
        location: "Munnar",
        country: "India",
        category: "Villa",
        geometry: { type: "Point", coordinates: [77.0595, 10.0889] }
    },
    {
        title: "Snow-Capped Wooden Cabin",
        description: "A cozy, winter wonderland escape. Sip hot cocoa by the indoor stone fireplace while watching the snowfall through massive A-frame windows.",
        image: { url: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80", filename: "seed" },
        price: 7200,
        location: "Gulmarg",
        country: "India",
        category: "Mountain",
        geometry: { type: "Point", coordinates: [74.3804, 34.0484] }
    },
    {
        title: "Overwater Bungalow",
        description: "The ultimate luxury escape. Dive directly from your bedroom balcony into crystal-clear turquoise waters. Includes a glass-bottom floor in the living room.",
        image: { url: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80", filename: "seed" },
        price: 45000,
        location: "Maldives",
        country: "Maldives",
        category: "Luxury",
        geometry: { type: "Point", coordinates: [73.2207, 3.2028] }
    },
    {
        title: "Skyscraper View Apartment",
        description: "An ultra-modern high-rise apartment offering breathtaking, uninterrupted views of the city skyline. Building includes a rooftop pool and gym access.",
        image: { url: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80", filename: "seed" },
        price: 12000,
        location: "Dubai",
        country: "UAE",
        category: "Apartment",
        geometry: { type: "Point", coordinates: [55.2708, 25.2048] }
    },
    {
        title: "Secluded Desert Safari Tent",
        description: "Experience the magic of the golden dunes. Premium nomadic-style tents offering air conditioning, king-sized beds, and private camel rides at dawn.",
        image: { url: "https://images.unsplash.com/photo-1534008897995-27a23e859048?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80", filename: "seed" },
        price: 5500,
        location: "Jaisalmer",
        country: "India",
        category: "Camping",
        geometry: { type: "Point", coordinates: [70.9083, 26.9157] }
    }
];

const seedDB = async () => {
    // 1. Clear the old, broken database
    await Listing.deleteMany({});
    console.log("Old listings cleared...");
    
    // 2. IMPORTANT: We need to assign a real User ID to these properties.
    // Replace this string with the Object ID of the user you log in with!
    const ownerId = "6a3a8026163a04ef0296bfb4"; 

    // 3. Attach the owner to every listing
    for(let i = 0; i < seedListings.length; i++) {
        seedListings[i].owner = ownerId;
    }

    // 4. Save to database
    await Listing.insertMany(seedListings);
    console.log(`Successfully seeded ${seedListings.length} beautiful properties!`);
    mongoose.connection.close();
};

seedDB();