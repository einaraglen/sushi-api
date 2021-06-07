const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    permission: {
        type: Number,
        required: true,
    },
});

module.exports = mongoose.model("User", UserSchema);