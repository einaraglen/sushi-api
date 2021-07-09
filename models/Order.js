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
    waitTime: {
        type: Number,
        required: true,
    },
    created: {
        type: Date,
        default: () => { return new Date() },
    },
});

module.exports = mongoose.model("Order", OrderSchema);
