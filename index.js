const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

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
      
      //Home page inventory api
      app.get('/cars', async (req, res) => {
        const query = {}
        const cursor = carsCollection.find(query);
        const cars = await cursor.limit(6).toArray();
        res.send(cars)
      });
      //add inventory
      app.post('/inventory', async (req, res) => {
        const newItem = req.body;
        const result = await carsCollection.insertOne(newItem);
        res.send(result)
      })
      //all inventory
      app.get('/inventory', async (req, res) => {
        const query = {};
        const cursor = carsCollection.find(query);
        const inventory = await cursor.toArray();
        res.send(inventory);
      })
      // get inventory by id 
      app.get("/inventory/:id", async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        console.log(query);
        const result = await carsCollection.findOne(query);
        res.send(result);
      })
      // get quantity 
      app.get('/delivered/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const result = await carsCollection.findOne(query);
        const carQuantity = result.quantity;
        res.send({carQuantity});
      })
      //update quantity
      app.put('/update/:id', async (req, res) => {
        const id = req.params.id;
        const updateQuantity = req.body;
        const newQuantity = updateQuantity.Quantity-1
        const filter = { _id: ObjectId(id) };
        const options = { upsert: true };
        const updateDoc = {
          $set: {
            quantity: newQuantity,
          },
        };
        const result = await carsCollection.updateOne(filter, updateDoc, options);
        res.send(result);
      })
      //insert quantity
      app.put("/insert/:id", async (req, res) => {
        const id = req.params.id;
        const insertQuantity = req.body;
        const quantity = insertQuantity.Quantity
        console.log(quantity)
        const filter = { _id: ObjectId(id) };
        const options = { upsert: true };
        const updateDoc = {
          $set: {
            quantity: quantity,
          },
        };
        const result = await carsCollection.updateOne(
          filter,
          updateDoc,
          options
        );
        res.send(result);
      });
      //Delete inventory item
      app.delete('/delete/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const result = await carsCollection.deleteOne(query);
        res.send(result);
      })
      // get data by email 
      app.get('/myitem', async (req, res) => {
        const email = req.query.email;
        console.log(email)
        const query = { email: String(email) };
        console.log(query);
        const result = carsCollection.find(query);
        res.send(result);
        
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
