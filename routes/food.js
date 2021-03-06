const express = require("express");
const cors = require("cors");
const router = express.Router();
const Food = require("../models/Food");
const Order = require("../models/Order");
const { authenticateToken } = require("./tools");

//middleware
router.use(
    cors({
        origin: true,
        credentials: true,
        useFindAndModify: false,
    })
);
router.use(express.json());

router.get("/all", async (request, response) => {
    try {
        //for testing loading handeling on frontend, achives same result as Thread.Sleep(ms) in Java
        //await new Promise(resolve => setTimeout(resolve, 2000));
        const foods = await Food.find();
        response.send({ status: true, foods: foods });
    } catch (error) {
        response.send({ status: false, message: error.message });
    }
});

router.get("/all-complete", async (request, response) => {
    try {
        const food = await Food.find({ name: "Laks Maki"});
        const contents = await Content.find({_id: {"$in": food[0]["content"]}})
        response.send({content: contents})
    } catch (error) {
        response.send({ status: false, message: error.message });
    }
});

router.put("/update", authenticateToken, async (request, response) => {
    try {
        await Food.findOneAndUpdate(
            {
                _id: request.body.id,
            },
            request.body.update,
            { new: true }
        );
        const foods = await Food.find();
        response.send({ status: true, foods: foods, message: "Food updated" });
    } catch (error) {
        response.send({ status: false, message: error.message });
    }
});

//rnd comment
router.delete("/delete", authenticateToken, async (request, response) => {
    try {
        //clean out to be deleted food from all orders containing it
        await Order.updateMany({ food: request.body.id}, { "$pull": { "food": request.body.id }}, { safe: true, multi:true });
        await Food.findByIdAndDelete(request.body.id);
        const foods = await Food.find();
        response.send({ status: true, foods: foods, message: "Food deleted" });
    } catch (error) {
        response.send({ status: false, message: error.message });
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
        response.send({ status: false, message: error.message });
    }
});

router.post("/add", authenticateToken, async (request, response) => {
    try {
        await new Food(request.body.food).save();
        let foods = await Food.find();
        response.send({ status: true, foods: foods, message: "Food added" });
    } catch (error) {
        response.send({ status: false, message: error.message });
    }
});

module.exports = router;
