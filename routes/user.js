const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();
const Food = require("../models/User");
const User = require("../models/User");
const { response } = require("express");

//ACCESS_TOKEN_SECRET & REFRESH_TOKEN_SECRET
require("dotenv").config();

//for reading body of request
router.use(express.json());

router.post("/add", async (request, response) => {
    try {
        //encrypting password from body with .hash(password, salt-seed)
        const hashedPassword = await bcrypt.hash(request.body.password, 10);

        //create instance of new User
        const user = new User({
            username: request.body.username,
            password: hashedPassword,
            permission: request.body.permission,
        });

        //save user to database
        const savedUser = await user.save();
        //send message if User is added
        response.send({
            status: true,
            message: "User added!",
            user: savedUser,
        });
    } catch (error) {
        response.send({ status: false, error: error.message });
    }
});

router.post("/login", async (request, response) => {
    try {
        //check if username field is sent
        if (!request.body.username) {
            return response.send({
                status: false,
                message: "No username received",
            });
        }

        //user actions
        await User.findOne(
            { username: request.body.username },
            async (error, user) => {
                //catch and send error message
                if (error) {
                    return response.send({ status: false, error: error });
                }
                //check if password field has been received from request
                if (!request.body.password) {
                    return response.send({
                        status: false,
                        message: "No password received",
                    });
                }

                //compare request password to user password
                const result = await bcrypt.compare(
                    request.body.password,
                    user.password
                );
                if (result) {
                    const accessToken = jwt.sign(
                        { user },
                        process.env.ACCESS_TOKEN_SECRET
                    );
                    return response.send({
                        status: true,
                        message: "Login Complete",
                        accessToken: accessToken,
                    });
                }

                //if nothing, return 'incorrect password' massage
                return response.send({
                    status: false,
                    message: "Incorrect password",
                });
            }
        );
    } catch (error) {
        //exception handeling with response
        response.send({ status: false, error: error.message });
    }
});

const authenticateToke = (request, response, next) => {
    const authenticationHeader = request.headers["authorization"];
    //auth header string = "BEARER <token>" so we collect the [1] string after split
    const token = authenticationHeader && authenticationHeader.split(" ")[1];
    if (!token) {
        return response.send({ status: false, message: "No token found in request" });
    }

    //vertifying token
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
        if (error) {
            return response.send({ status: false, error: error });
        }
        //set verified user
        require.user = user;
        //move on from authentication middleware
        next();
    });
};

module.exports = router;
