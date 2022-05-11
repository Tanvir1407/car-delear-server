const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");

require("dotenv").config();

const port = process.env.PORT || 5000;
const app = express();

// middleware
app.use(cors());
app.use(express.json());



const uri =
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3ohgy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {

    try {
      await client.connect();
      const carsCollection = client.db("warehouse").collection("cars");
      
      //test
      app.get('/cars', async (req, res) => {
        const query = {}
        const cursor = carsCollection.find(query);
        const cars = await cursor.limit(6).toArray();
        res.send(cars)
      })

  }
    finally {
        
  }
}

run().catch(console.dir);

//check
app.get("/", (req, res) => {
  res.send("assignment check");
});

app.listen(port);
