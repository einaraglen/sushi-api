//ACCESS_TOKEN_SECRET & REFRESH_TOKEN_SECRET
require("dotenv").config();
const jwt = require("jsonwebtoken");

const authenticateToken = (request, response, next) => {
    //auth header string = "ACCESS_TOKEN=<token>"
    const token = getCookie(request, "ACCESS_TOKEN");

    //vertifying token
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
        if (error) {
            return response.send({
                status: false,
                message: `${error.name} ${error.message}`,
            });
        }
        //set verified user
        require.user = user;
        //move on from authentication middleware
        next();
    });
};

const getCookie = (request, key) => {
    //yeet if null
    if (!request.headers.cookie) return null;
    //string magic to get [cookie(1), cookie(2) ... cookie(n)] // including the 'g' in replace makes the search global
    let cookies = request.headers.cookie.replace(/ /g, "").split(";");
    //iterate through, if match with key, return pure token value
    for (let i = 0; i < cookies.length; i++) {
        if (cookies[i].indexOf(key) > -1) return cookies[i].replace(`${key}=`, ``);
    }
    return null;
}

exports.authenticateToken = authenticateToken;
exports.getCookie = getCookie;