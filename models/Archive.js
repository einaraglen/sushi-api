const mongoose = require("mongoose");
mongoose.set('useCreateIndex', true);

const ArchiveSchema = mongoose.Schema({
    shortid: {
        type: String,
        required: true,
    },
    food: {
        type: [mongoose.Schema.Types.ObjectId],
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    created: {
        type: Date,
        required: true,
    },
    closed: {
        type: Date,
        default: () => { return new Date() },
    },
});

module.exports = mongoose.model("Archive", ArchiveSchema);
