const mongoose = require("mongoose");

const TypeSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    pieces : {
        type: Number,
        required: true,
    }
});

module.exports = mongoose.model("Type", TypeSchema);