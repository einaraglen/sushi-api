const mongoose = require("mongoose");

const TokenScema = mongoose.Schema({
    token: {
        type: String,
        required: true,
    },
    created: {
        type: Date,
        default: Date.now(),
    },
});

module.exports = mongoose.model("Token", TokenScema);