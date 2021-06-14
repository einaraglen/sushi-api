const mongoose = require("mongoose");
mongoose.set('useCreateIndex', true);

const FoodSchema = mongoose.Schema({
    number: {
        type: Number,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    content: {
        type: [String],
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
    type: {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model("Food", FoodSchema);
