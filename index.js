const connection = require("./connection");
const express = require("express");
const app = express();
const PORT = 8080;

const MongoClient = require("mongodb").MongoClient;

MongoClient.connect(connection, {
    useUnifiedTopology: true,
}).then((client) => {
    console.log("Connected to Database");
    const db = client.db("sushi-database");
    const foodCollection = db.collection("food");

    app.get("/getfood", (request, respons) => {
        foodCollection
            .find()
            .toArray()
            .then((results) => {
                respons.send(results)
            })
            .catch((error) => console.error(error));
    });

    app.post("/addfood", (request, respons) => {
        foodCollection
            .insertOne(request.body)
            .then(() => {
                respons.send({ message: "Food Item Added" });
            })
            .catch((error) => console.error(error));
    });
});

app.use(express.json());

app.listen(PORT, () => console.log(`Listening to port: ${PORT}`));

app.get("/test", (request, respons) => {
    respons.status(200).send({
        testdata: "Test",
        status: true,
    });
});

app.post("/data/:id", (request, respons) => {
    //takes param as it is
    const { id } = request.params;
    //de-structures json and selects the key you want 'body'
    //if no 'body' key is found, body variable will be undefined
    const { body } = request.body;

    if (!body) {
        respons.status(418).send({ message: "No body!" });
    }

    respons.send({
        message: "Body is:" + body,
    });
});
