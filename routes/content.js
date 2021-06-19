const express = require("express");
const cors = require("cors");
const router = express.Router();
const Content = require("../models/Content");
const { authenticateToken } = require("./tools");

//middleware
router.use(
    cors({
        origin: ["https://sushi-panel.netlify.app/", "http://localhost:3000/"],
        credentials: true,
        useFindAndModify: false,
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
        await Content.findOneAndUpdate(
            {
                _id: request.body.id,
            },
            request.body.update,
            { new: true }
        );
        const contents = await Content.find();
        response.send({ status: true, contents: contents, message: "Content updated" });
    } catch (error) {
        response.send({ status: false, error: error.message });
    }
});

router.delete("/delete", authenticateToken, async (request, response) => {
    try {
        await Content.findByIdAndDelete(request.body.id);
        const contents = await Content.find();
        response.send({ status: true, contents: contents, message: "Content deleted" });
    } catch (error) {
        response.send({ status: false, message: error.message });
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
        await new Content(request.body.content).save();
        const contents = await Content.find();
        response.send({ status: true, contents: contents, message: "Content added" });
    } catch (error) {
        response.send({ status: false, error: error.message });
    }
});

module.exports = router;
