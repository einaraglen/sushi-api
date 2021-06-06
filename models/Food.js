const mongoose = require("mongoose");

const FoodSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    pieces: {
        type: Number,
        required: false,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model("Food", FoodSchema);