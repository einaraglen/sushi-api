const express = require("express");
const cors = require("cors");
const router = express.Router();
const { authenticateToken } = require("./tools");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
const multer = require("multer");
const fileUpload = multer();

//we need that CLIENT_ID from heroku
require("dotenv").config();

//middleware
router.use(
    cors({
        origin: true,
        credentials: true,
        useFindAndModify: false,
    })
);
router.use(express.json());

//this is our connection to the image api, read from .env locally on heroku server
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});

const getAllImages = () => {
    return cloudinary.search
            .expression("resource_type:image")
            .sort_by("public_id", "desc")
            .execute()
            .then((result) => result);
}

router.put("/destroy", authenticateToken, async (request, response) => {
    try {
        //error handling
        if (!request.body.public_id)
            return response.send({
                status: false,
                message: "Please provide 'public_id'",
            });
        //time to remove, if not valid pub_id, error will be thrown
        await cloudinary.uploader.destroy(
            request.body.public_id,
            (result) => result
        );
        let images = await getAllImages();
        //let user know how it went
        response.send({
            status: true,
            images: images.resources,
            message: `Image ${request.body.public_id} deleted`,
        });
    } catch (error) {
        response.send({ status: false, message: error.message });
    }
});

router.get("/all", authenticateToken, async (request, response) => {
    try {
        let images = await getAllImages();
        response.send({ status: true, images: images.resources });
    } catch (error) {
        response.send({ status: false, message: error });
    }
});

router.post(
    "/upload",
    authenticateToken,
    fileUpload.single("image"),
    (request, response, next) => {
        const streamUpload = (request) => {
            return new Promise((resolve, reject) => {
                let stream = cloudinary.uploader.upload_stream(
                    (error, result) => {
                        !result ? reject(error) : resolve(result);
                    }
                );
                streamifier.createReadStream(request.file.buffer).pipe(stream);
            });
        };

        const upload = async (req) => {
            try {
                let prevImages = await getAllImages();
                await streamUpload(request);
                //for testing loading handeling on frontend, achives same result as Thread.Sleep(ms) in Java
                await new Promise(resolve => setTimeout(resolve, 2000));
                let images = await getAllImages();
                //if api is being slow :( very hack solution i know!
                while (prevImages.resources.length === images.resources.length) {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    images = await getAllImages();
                }
                response.send({
                    status: true,
                    message: "Image uploaded",
                    images: images.resources,
                });
            } catch (error) {
                response.send({ status: false, message: error.toString() });
            }
        };

        //execute
        upload(request);
    }
);

module.exports = router;
