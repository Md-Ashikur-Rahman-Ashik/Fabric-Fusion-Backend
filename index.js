const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: ["http://localhost:5173/"],
  })
);
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tx9lkv1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // await client.connect();

    const craftCollection = client.db("craftDB").collection("craft");

    app.get("/crafts", async (req, res) => {
      const cursor = craftCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/crafts/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const craft = await craftCollection.findOne(query);
      res.send(craft);
    });

    app.get("/craft/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const craft = await craftCollection.find(query).toArray();
      res.send(craft);
    });

    app.post("/crafts", async (req, res) => {
      const newCraft = req.body;
      // console.log(newCraft);
      const result = await craftCollection.insertOne(newCraft);
      res.send(result);
    });

    app.put("/craft/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedCraft = req.body;
      const craft = {
        $set: {
          name: updatedCraft.name,
          photo: updatedCraft.photo,
          subcategoryBox: updatedCraft.subcategoryBox,
          shortDescription: updatedCraft.shortDescription,
          price: updatedCraft.price,
          rating: updatedCraft.rating,
          customizationBox: updatedCraft.customizationBox,
          processingTime: updatedCraft.processingTime,
          available: updatedCraft.available,
          email: updatedCraft.email,
          userName: updatedCraft.userName,
        },
      };
      const result = await craftCollection.updateOne(query, craft, options);
      res.send(result);
    });

    app.delete("/craft/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await craftCollection.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(port, () => {
  console.log(`Server is running from port: ${port}`);
});
