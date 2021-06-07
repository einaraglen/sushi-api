const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();
const User = require("../models/User");
const Token = require("../models/Token");
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

router.get("/test", authenticateToken, (request, response) => {
    try {
        response.send({message: "ACCESS GRANTED"});
    } catch (error) {
        response.send({ status: false, error: error.message });
    }
})

router.post("/refresh", async (request, response) => {
    try {
        const oldRefreshToken = request.headers.cookie
            .split(";")[1]
            .replace("REFRESH_TOKEN=", "")
            .trim();
        //check if token is in request
        if (!oldRefreshToken) {
            return response.send({
                status: false,
                message: "Token is null",
            });
        }
        const token = await Token.findOne({ token: oldRefreshToken });
        //check if token exists in database
        if (!token) {
            return response.send({
                status: false,
                message: "Token not found, access denied",
            });
        }

        jwt.verify(
            oldRefreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            (error, user) => {
                if (error) {
                    return response.send({
                        status: false,
                        message: "Validation error",
                    });
                }
                //generate new access token
                const accessToken = generateAccessToken({
                    name: user.username,
                });

                //set new access token cookie
                return response.cookie("ACCESS_TOKEN", accessToken).send({
                    status: true,
                    message: "Refresh complete",
                });
            }
        );
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
                message: "Username is null",
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
                        message: "Password is null",
                    });
                }

                //compare request password to user password
                const result = await bcrypt.compare(
                    request.body.password,
                    user.password
                );
                if (result) {
                    const accessToken = generateAccessToken(user);
                    const refresToken = new Token({
                        token: jwt.sign(
                            { user },
                            process.env.REFRESH_TOKEN_SECRET
                        ),
                    });
                    //save refreshToken for later refresh
                    const savedToken = await refresToken.save();

                    return response
                        .cookie("ACCESS_TOKEN", accessToken)
                        .cookie("REFRESH_TOKEN", savedToken.token)
                        .send({
                            status: true,
                            message: "Login Complete",
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

const generateAccessToken = (user) => {
    return jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "10s",
    });
};

//middleware only works as es5 function not es6 () =>
function authenticateToken(request, response, next) {
    const authenticationHeader = request.headers["authorization"];
    //auth header string = "BEARER <token>" so we collect the [1] string after split
    const token = request.headers.cookie
    .split(";")[0]
    .replace("ACCESS_TOKEN=", "")
    .trim();
    if (!token) {
        return response.send({
            status: false,
            message: "No token found in request",
        });
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