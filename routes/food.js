const express = require("express");
const router = express.Router();
const Food = require("../models/Food");

//For reading body of request
router.use(express.json());

router.get("/all", async (request, response) => {
    try {
        const foods = await Food.find();
        response.send({ status: true, foods: foods });
    } catch (error) {
        response.send({ status: false, error: error });
    }
});

router.get("/find/:id", async (request, response) => {
    try {
        const regex = new RegExp(request.params.id, "i"); // i for case insensitive
        //find matches in names
        const byName = await Food.find({ name: { $regex: regex } });
        //find matches in description
        const byDescription = await Food.find({ description: { $regex: regex } });
        //send merged array of results
        response.send({ status: true, results: byName.concat(byDescription) });
    } catch (error) {
        response.send({ status: false, error: error });
    }
});

router.post("/add", async (request, response) => {
    const food = new Food({
        name: request.body.name,
        pieces: request.body.pieces,
        description: request.body.description,
        price: request.body.price,
        image: request.body.image,
    });

    try {
        const savedFood = await food.save();
        response.send({ status: true, added: savedFood });
    } catch (error) {
        response.send({ status: false, error: error });
    }
});

module.exports = router;
