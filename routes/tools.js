//ACCESS_TOKEN_SECRET & REFRESH_TOKEN_SECRET
require("dotenv").config();
const jwt = require("jsonwebtoken");

function authenticateToken(request, response, next) {
    if (!request.headers.cookie)  {
        return response.send({
            status: false,
            message: "No cookie found in request",
        });
    }
    //auth header string = "ACCESS_TOKEN=<token>" so we collect the [1] string after split
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
}

exports.authenticateToken = authenticateToken;