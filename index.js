const express = require("express");
const app = express();
const mongoose = require("mongoose");
//define PORT for listening
const PORT = 8080;
//DB_CONNECTION
require("dotenv").config();

//import routes
const foodRoute = require("./routes/food");
const userRoute = require("./routes/user");
const secretRoute = require("./routes/secret");
const typeRoute = require("./routes/type");
const contentRoute = require("./routes/content");

//middleware setup for routes
app.use("/food", foodRoute);
app.use("/user", userRoute);
app.use("/secret", secretRoute);
app.use("/type", typeRoute);
app.use("/content", contentRoute);

//connect to DB
mongoose.connect(
    process.env.DB_CONNECTION,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => {
        console.log("Connected to MongoDB");
    }
);

app.listen(PORT, () => console.log(`Listening to port: ${PORT}`));
