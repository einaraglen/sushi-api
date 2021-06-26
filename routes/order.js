const express = require("express");
const cors = require("cors");
const router = express.Router();
const Order = require("../models/Order");
const Archive = require("../models/Archive");
const { authenticateToken } = require("./tools");
const ShortUniqueId = require('short-unique-id');

//middleware
router.use(
    cors({
        origin: true,
        credentials: true,
        useFindAndModify: false,
    })
);
router.use(express.json());

//TODO: create archive method, that is authenticated and saves what kind of food was ordered, 
//but deletes the order from orders-db

router.get("/all", authenticateToken, async (request, response) => {
    try {
        //for testing loading handeling on frontend, achives same result as Thread.Sleep(ms) in Java
        //await new Promise(resolve => setTimeout(resolve, 2000));
        const orders = await Order.find();
        response.send({ status: true, orders: orders });
    } catch (error) {
        response.send({ status: false, message: error.message });
    }
});

router.get("/archives", authenticateToken, async (request, response) => {
    try {
        const archives = await Archive.find();
        response.send({ status: true, archives: archives });
    } catch (error) {
        response.send({ status: false, message: error.message });
    }
});


router.put("/update", authenticateToken, async (request, response) => {
    try {
        await Order.findOneAndUpdate(
            {
                _id: request.body.id,
            },
            request.body.update,
            { new: true }
        );
        if (!request.body.update.done) {
            const order = await Order.findOne({ _id: request.body.id });
            await new Archive({
                shortid: order.shortid,
                food: order.food,
                price: order.price,
                created: order.created,
            }).save();
            await Order.findByIdAndDelete(request.body.id);
        }
        const orders = await Order.find();
        response.send({ status: true, orders: orders, message: !request.body.update.done ? "Order Archived" : "Order updated" });
    } catch (error) {
        response.send({ status: false, message: error.message });
    }
});

router.post("/add", authenticateToken, async (request, response) => {
    try {
        //fancy lil uid that is given to a order as a recognition token per say
        const uid = ShortUniqueId();
        //here we do not wanna dump all orders on the respons, since a order can be submitted by a user,
        //hens if the user looks at the response they will see all active orders, thats no bueno
        await new Order({
            ...request.body,
            shortid: uid().toUpperCase(),
        }).save();
        let orders = await Order.find();
        response.send({ status: true, orders: orders, message: "Order placed" });
    } catch (error) {
        response.send({ status: false, message: error.message });
    }
});

module.exports = router;
