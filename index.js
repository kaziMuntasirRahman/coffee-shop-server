const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
require('dotenv').config();
const cors = require('cors');
const app = express();
const port = process.env.PORT || 8000;

//middleware
app.use(cors());
app.use(express.json());

//------------------MongoDb starts----------------------
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_KEY}@clustermuntasir.bwzlexy.mongodb.net/?retryWrites=true&w=majority&appName=clusterMuntasir`;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const database = client.db("CoffeeDB");
    const coffeeCollection = database.collection("coffeeCollection");
    const userCollection = database.collection("userCollection");

    //-------create-----------
    app.post('/coffee', async (req, res) => {
      const newCoffee = req.body;
      const result = await coffeeCollection.insertOne(newCoffee);
      res.send(result);
    })

    //------read------
    app.get('/coffee', async (req, res) => {
      const cursor = coffeeCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    // ------delete------
    app.delete('/coffee/:_id', async (req, res) => {
      const id = req.params._id;
      const result = await coffeeCollection.deleteOne({ _id: new ObjectId(id) })
      res.send(result);
    })

    //--------update------
    app.put('/coffee/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateCoffee = req.body;
      const updateDoc = {
        $set: {
          name: updateCoffee.name,
          chef: updateCoffee.chef,
          supplier: updateCoffee.supplier,
          taste: updateCoffee.taste,
          category: updateCoffee.category,
          details: updateCoffee.details,
          photoURL: updateCoffee.photoURL
        }
      }
      const result = await coffeeCollection.updateOne(query, updateDoc, options);
      res.send(result);
    })


    //------update--------
    app.get('/coffee/:_id', async (req, res) => {
      const id = req.params._id;
      const query = { _id: new ObjectId(id) };
      const result = await coffeeCollection.findOne(query);
      res.send(result);
    })


    ///------------users---------------
    app.post('/users', async(req, res)=>{
      const newUser = req.body;
      const result = await userCollection.insertOne(newUser);
      res.send(result);
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);
//-----------------Mongo DB ends-----------------------



//----------------------------------
app.get('/', (req, res) => {
  res.send("Hello, this server is running well.....");
})



//------------------
app.listen(port, () => {
  console.log("This server is running in port: ", port);
})