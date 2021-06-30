const express = require("express");
const cors = require("cors");
const router = express.Router();
const { authenticateToken } = require("./tools");
const axios = require("axios");

//we need that CLIENT_ID from heroku
require("dotenv").config();

//middleware
router.use(
    cors({
        origin: true,
        credentials: true,
        useFindAndModify: false,
    })
);
router.use(express.json());

router.get("/token", (request, response) => {
    try {
        response.send({ status: true, id: process.env.CLIENT_ID });
    } catch (error) {
        response.send({ status: false, message: error.message });
    }
});

module.exports = router;
