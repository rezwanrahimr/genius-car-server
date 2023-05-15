const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.port || 5000;
require("dotenv").config();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.jv78gou.mongodb.net/?retryWrites=true&w=majority`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const serviceCollection = client.db("genius-car").collection("services");
    const orderCollection = client.db("genius-car").collection("order");

    // Get Services
    app.get("/services", async (req, res) => {
      const quarry = {};
      const cursor = serviceCollection.find(quarry);
      const result = await cursor.toArray();
      res.send(result);
    });

    // Get Specific Service.
    app.get("/services/:id", async (req, res) => {
      const { id } = req.params;
      console.log(id);
      const quarry = { _id: new ObjectId(id) };
      const result = await serviceCollection.findOne(quarry);
      res.send(result);
    });

    // Post Order
    app.post("/order", async (req, res) => {
      const data = req.body;
      const result = await orderCollection.insertOne(data);
      res.send(result);
    });

    // Get Order
    app.get("/orders", async (req, res) => {
      console.log(req.query);
      let quarry = {};
      if (req.query?.email) {
        quarry = {
          email: req.query?.email,
        };
      }
      const cursor = orderCollection.find(quarry);
      const result = await cursor.toArray();
      res.send(result);
    });

    // Delete Order
    app.delete("/orders/:id", async (req, res) => {
      const { id } = req.params;
      const quarry = { _id: new ObjectId(id) };
      const result = await orderCollection.deleteOne(quarry);
      res.send(result);
    });
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello world");
});
app.listen(port, () => {
  console.log(`server is running...${port}`);
});
