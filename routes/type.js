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
        response.send({ status: false, message: error.message });
    }
});

router.put("/update", authenticateToken, async (request, response) => {
    try {
        await Type.findOneAndUpdate(
            {
                _id: request.body.id,
            },
            request.body.update,
            { new: true }
        );
        let types = await Type.find();
        response.send({ status: true, types: types });
    } catch (error) {
        response.send({ status: false, message: error.message });
    }
});

router.delete("/delete", authenticateToken, async (request, response) => {
    try {
        await Type.findByIdAndDelete({ _id: request.body.id });
        let types = await Type.find();
        response.send({ status: true, types: types });
    } catch (error) {
        response.send({ status: false, message: error.message });
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
        response.send({ status: false, message: error.message });
    }
});

router.post("/add", authenticateToken, async (request, response) => {
    try {
        await new Type(request.body.type).save();
        let types = await Type.find();
        response.send({ status: true, types: types });
    } catch (error) {
        response.send({ status: false, message: error.message });
    }
});

module.exports = router;
