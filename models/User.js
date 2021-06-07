const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

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

UserSchema.methods.comparePassword = async (requestPassword) => {
    console.log(requestPassword)
    console.log(this)
    return await bcrypt.compare(requestPassword, this.password);
}

module.exports = mongoose.model("User", UserSchema);
