const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
//define PORT for listening
const PORT = 8080;
//DB_CONNECTION
require("dotenv").config();

//import routes
const foodRoute = require("./routes/food");
const userRoute = require("./routes/user");

//middleware setup for routes
app.use("/food", foodRoute);
app.use("/user", userRoute);

//middleware
app.use(express.json());

//connect to DB
mongoose.connect(
    process.env.DB_CONNECTION,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => {
        console.log("Connected to MongoDB");
    }
);

app.listen(PORT, () => console.log(`Listening to port: ${PORT}`));
