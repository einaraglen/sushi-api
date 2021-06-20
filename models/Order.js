const mongoose = require("mongoose");
mongoose.set('useCreateIndex', true);

const OrderSchema = mongoose.Schema({
    shortid: {
        type: String,
        required: true,
    },
    food: {
        type: [mongoose.Schema.Types.ObjectId],
        required: true,
    },
    done: {
        type: Boolean,
        default: false,
    },
    active: {
        type: Boolean,
        default: true,
    },
    price: {
        type: Number,
        required: true,
    },
    comment: {
        type: String,
        default: "No Comment Added"
    },
    created: {
        type: Date,
        default: Date.now(),
    },
});

module.exports = mongoose.model("Order", OrderSchema);
