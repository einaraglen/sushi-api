const express = require("express");
const cors = require("cors");
const router = express.Router();
const Food = require("../models/Food");
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
        const foods = await Food.find();
        response.send({ status: true, foods: foods });
    } catch (error) {
        response.send({ status: false, error: error.message });
    }
});

router.put("/update", async (request, response) => {
    try {
        let food = await Food.findOneAndUpdate({
            _id: request.body.id,
        }, request.body.update, { new: true });
        response.send({ status: true, food: food });
    } catch (error) {
        response.send({ status: false, error: error.message });
    }
});

router.get("/find/:id", async (request, response) => {
    try {
        const regex = new RegExp(request.params.id, "i"); // i for case insensitive
        //find matches in names
        const byName = await Food.find({ name: { $regex: regex } });
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
        const food = new Food({
            number: request.body.number,
            name: request.body.name,
            content: request.body.content,
            price: request.body.price,
            image: request.body.image,
            type: request.body.type,
        });

        const savedFood = await food.save();
        response.send({ status: true, added: savedFood });
    } catch (error) {
        response.send({ status: false, error: error.message });
    }
});

module.exports = router;
