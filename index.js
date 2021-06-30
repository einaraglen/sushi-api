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
const orderRoute = require("./routes/order");
const imageRoute = require("./routes/image");

//middleware setup for routes
app.use("/food", foodRoute);
app.use("/user", userRoute);    
app.use("/secret", secretRoute);
app.use("/type", typeRoute);
app.use("/content", contentRoute);
app.use("/order", orderRoute);
app.use("/image", imageRoute);

const mongooseOptions = { 
    useNewUrlParser: true,
    useUnifiedTopology: true,
    server: { 
        socketOptions: { 
          keepAlive: 300000, connectTimeoutMS: 30000 
        } 
      }, 
      replset: { 
        socketOptions: { 
          keepAlive: 300000, 
          connectTimeoutMS : 30000 
        } 
      } 
}

//connect to DB
mongoose.connect(process.env.DB_CONNECTION, mongooseOptions, () => {
    console.log("Connected to MongoDB");
});

app.listen(process.env.PORT || PORT, () => console.log(`Listening to port: ${PORT}`));
