const express = require("express");
const router = express.Router();
const Food = require("../models/Food");

//for reading body of request
router.use(express.json());

router.get("/all", async (request, response) => {
    try {
        const foods = await Food.find();
        response.send({ status: true, foods: foods });
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

router.post("/add", async (request, response) => {
    try {
        const food = new Food({
            name: request.body.name,
            pieces: request.body.pieces,
            description: request.body.description,
            price: request.body.price,
            image: request.body.image,
        });

        const savedFood = await food.save();
        response.send({ status: true, added: savedFood });
    } catch (error) {
        response.send({ status: false, error: error.message });
    }
});

module.exports = router;
