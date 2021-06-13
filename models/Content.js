const mongoose = require("mongoose");

const ContentSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model("Content", ContentSchema);