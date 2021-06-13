const express = require("express");
const cors = require("cors");
const router = express.Router();
const Type = require("../models/Type");
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
        const types = await Type.find();
        response.send({ status: true, types: types });
    } catch (error) {
        response.send({ status: false, error: error.message });
    }
});

router.put("/update", authenticateToken, async (request, response) => {
    try {
        let type = await Type.findOneAndUpdate({
            _id: request.body.id,
        }, request.body.update, { new: true });
        response.send({ status: true, type: type});
    } catch (error) {
        response.send({ status: false, error: error.message });
    }
});

router.get("/find/:id", async (request, response) => {
    try {
        const regex = new RegExp(request.params.id, "i"); // i for case insensitive
        //find matches in names
        const byName = await Type.find({ name: { $regex: regex } });
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
        const type = new Type({
            name: request.body.name,
            pieces: request.body.pieces,
        });

        const savedType = await type.save();
        response.send({ status: true, added: savedType });
    } catch (error) {
        response.send({ status: false, error: error.message });
    }
});

module.exports = router;
