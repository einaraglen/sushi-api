const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();
const User = require("../models/User");
const Token = require("../models/Token");
const { authenticateToken, getCookie } = require("./tools");
const cors = require("cors");
const session = require("express-session");

//ACCESS_TOKEN_SECRET & REFRESH_TOKEN_SECRET
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
/*router.use(
    session({
        proxy: true,
        
    })
);*/

const COOKIE_CONFIG = {
    secure: true,
    sameSite: "none",
    httpOnly: true,
};

router.post("/add", async (request, response) => {
    try {
        if (!request.body.username || !request.body.password) {
            return response.send({
                status: false,
                message: "Missing parameters",
            });
        }
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
        response.send({ status: false, message: error.message });
    }
});

router.delete("/logout", async (request, response) => {
    try {
        //Remove all access tokens
        await Token.deleteMany();
        response
            .cookie("ACCESS_TOKEN", "", {...COOKIE_CONFIG, expires: new Date(0) })
            .cookie("REFRESH_TOKEN", "", {...COOKIE_CONFIG, expires: new Date(0) })
            .send({
                status: true,
                message: "User Logged out, token removed",
            });
    } catch (error) {
        response.send({ status: false, message: error.message });
    }
});

//auth test
router.get("/validate", authenticateToken, (request, response) => {
    try {
        response.send({ status: true, message: "Valid Token" });
    } catch (error) {
        response.send({ status: false, message: error.message });
    }
});

router.get("/refresh", async (request, response) => {
    try {
        const oldRefreshToken = getCookie(request, "REFRESH_TOKEN");
        console.log(oldRefreshToken)
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
                return response
                    .cookie("ACCESS_TOKEN", accessToken, COOKIE_CONFIG)
                    .send({
                        status: true,
                        message: "Refresh complete",
                    });
            }
        );
    } catch (error) {
        response.send({ status: false, message: error.message });
    }
});

router.post("/login", async (request, response) => {
    try {
        //check if username field is sent
        if (!request.body.username || !request.body.password) {
            return response.send({
                status: false,
                message: "Missing parameters",
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

                if (!user) {
                    return response.send({
                        status: false,
                        message: "User does not exist",
                    });
                }

                //compare request password to user password
                const result = await bcrypt.compare(
                    request.body.password,
                    user.password
                );
                if (result) {
                    const accessToken = generateAccessToken(user);
                    //Remove all access tokens
                    await Token.deleteMany();
                    const refresToken = new Token({
                        token: jwt.sign(
                            { user },
                            process.env.REFRESH_TOKEN_SECRET
                        ),
                    });
                    //save refreshToken for later refresh
                    const savedToken = await refresToken.save();

                    return response
                        .cookie("ACCESS_TOKEN", accessToken, COOKIE_CONFIG)
                        .cookie(
                            "REFRESH_TOKEN",
                            savedToken.token,
                            COOKIE_CONFIG
                        )
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
        response.send({ status: false, message: error.message });
    }
});

const generateAccessToken = (user) => {
    return jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
        //expiresIn: "10s",
        expiresIn: "1m",
    });
};

module.exports = router;
