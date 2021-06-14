const express = require("express");
const cors = require("cors");
const router = express.Router();
const Secret = require("../models/Secret");

//middleware
router.use(cors({
    origin: true,
    credentials: true,
}));
router.use(express.json());

router.get("/check/:id", async (request, response) => {
    try {
        const secret = await Secret.findOne();
        let result = request.params.id === secret.secret;
        response.send({
            status: result,
            secret: result ? "Correct secret" : "Incorrect secret",
        });
    } catch (error) {
        response.send({ status: false, message: error.message });
    }
});

module.exports = router;
