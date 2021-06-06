const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
//Define PORT for listening
const PORT = 8080;
//DB_CONNECTION
require("dotenv/config");

//Import routes
const foodRoute = require("./routes/food");

//Middleware setup for routes
app.use("/food", foodRoute);
//Middleware
app.use(express.json());

//Connect to DB
mongoose.connect(
    process.env.DB_CONNECTION,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => {
        console.log("Connected to MongoDB");
    }
);

app.listen(PORT, () => console.log(`Listening to port: ${PORT}`));
