const cloudinary = require('cloudinary').v2;
const { Readable } = require("stream");

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

const uploadBufferToCloudinary = (buffer) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { folder: "WonderPlace_DEV", resource_type: "image" },
            (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }
        );

        Readable.from(buffer).pipe(uploadStream);
    });
};

module.exports = { cloudinary, uploadBufferToCloudinary };
