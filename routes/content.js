const express = require("express");
const cors = require("cors");
const router = express.Router();
const Content = require("../models/Content");
const { authenticateToken } = require("./tools");

//middleware
router.use(
    cors({
        origin: true,
        credentials: true,
    })
);
router.use(express.json());

router.get("/all", async (request, response) => {
    try {
        //for testing loading handeling on frontend, achives same result as Thread.Sleep(ms) in Java
        //await new Promise(resolve => setTimeout(resolve, 2000));
        const contents = await Content.find();
        response.send({ status: true, contents: contents });
    } catch (error) {
        response.send({ status: false, error: error.message });
    }
});

router.put("/update", authenticateToken, async (request, response) => {
    try {
        let content = await Content.findOneAndUpdate({
            _id: request.body.id,
        }, request.body.update, { new: true });
        response.send({ status: true, content: content});
    } catch (error) {
        response.send({ status: false, error: error.message });
    }
});

router.get("/find/:id", async (request, response) => {
    try {
        const regex = new RegExp(request.params.id, "i"); // i for case insensitive
        //find matches in names
        const byName = await Content.find({ name: { $regex: regex } });
        response.send({
            status: true,
            results: byName,
        });
    } catch (error) {
        response.send({ status: false, error: error.message });
    }
});

router.post("/add", authenticateToken, async (request, response) => {
    try {
        const content = new Content({
            name: request.body.name,
        });

        const savedContent = await content.save();
        response.send({ status: true, added: savedContent });
    } catch (error) {
        response.send({ status: false, error: error.message });
    }
});

module.exports = router;
