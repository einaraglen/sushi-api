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
        type: [mongoose.Schema.Types.ObjectId],
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
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    }
});

module.exports = mongoose.model("Food", FoodSchema);
