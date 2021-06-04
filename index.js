const connection = require('./connection');
const express = require("express");
const app = express();
const PORT = 8080;

const MongoClient = require("mongodb").MongoClient;

MongoClient.connect(connection.CONNECTION_STRING, (err, client) => {
    // ... do something here
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
