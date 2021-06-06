const express = require("express");
const router = express.Router();
const Food = require("../models/Food");

//For reading body of request
router.use(express.json())

router.get("/all", async (request, response) => {
    try {
        const foods = await Food.find();
        response.send(foods);
    } catch (error) {
        response.send(error);
    }
});

router.post("/add", async (request, response) => {
    const food = new Food({
        name: request.body.name,
        description: request.body.description,
        price: request.body.price,
        image: request.body.image,
    });

    try {
        const savedFood = await food.save();
        response.send(savedFood);
    } catch (error) {
        response.send(error);
    }
});

module.exports = router;
