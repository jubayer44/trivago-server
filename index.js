const express = require('express');
const cors = require('cors');
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT | 5000;

const app = express();

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.rceu7iq.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
    try {
        const userCollection = client.db("UserInfo").collection("userEmail")
        const citiesCollection = client.db("UserInfo").collection("allCities")

        app.get("/user", async (req, res) => {
            const email = req.query.email;
            const filter = await userCollection.findOne({email: email});
            if(!filter){
                return res.send(false)
            }
            res.send(filter);
        })

        app.get("/loginPassword/:id", async (req, res) => {
            const userEmail = req.params.id;
            const result = await userCollection.findOne({email: userEmail});
            res.send(result);
        });

        app.put("/addEmail", async (req, res) => {
            const email = req.body;
            const filter = await userCollection.findOne({email: email.email})
            if(filter){
                return res.send({acknowledged: false})
            }
            const result = await userCollection.insertOne(email);
            res.send(result)
        });

        app.get("/topCities", async (req, res) => {
            const filter = await citiesCollection.find({status: "top-cities"}).toArray();
            res.send(filter);
        });
        app.get("/topDestinations", async (req, res) => {
            const filter = await citiesCollection.find({status: "destinations"}).toArray();
            res.send(filter);
        });

        app.get("/city", async (req, res) => {
            const city = req.query.city;
            const filter = await citiesCollection.find({city: city.toLowerCase()}).toArray();
            res.send(filter);
        });
    }
    finally {

    }
}
run().catch(err => console.log(err))




app.get("/", (req, res) => {
    res.send("Server is running");
  });
  
  app.listen(port, () => {
    console.log(`server listening on port${port}`);
  });