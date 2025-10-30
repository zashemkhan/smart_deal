const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;

const uri =
  "mongodb+srv://smartdbUser:AjUJ4iLEwAfOYYik@cluster0.5xvfsxg.mongodb.net/?appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("smart deals ser is running");
});

async function run() {
  try {
    await client.connect();
    // database
    const db = client.db("smartdb_user");
    // collection
    const productsCollection = db.collection("products");

    // paoar jonno
    app.get("/products", async (req, res) => {
      const cursor = productsCollection.find();
      const results = await cursor.toArray(cursor);
      res.send(results); 
    });

    // single kisu paoar jonno
    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productsCollection.findOne(query);
      res.send(result);
    });

    // add/create product
    app.post("/products", async (req, res) => {
      //  data pathabo bodyte
      const products = req.body;
      const result = await productsCollection.insertOne(products);
      res.send(result);
    });

    // update korte
    app.patch("/products/:id", async (req, res) => {
      // req params theke id nebo
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const updatedProduct = req.body;
      const update = {
        // $set:updatedProduct
        $set: {
          name: updatedProduct.name,
          price: updatedProduct.price,
        },
      };
      const result = await productsCollection.updateOne(query, update);
      res.send(result);
    });

    // delete product
    app.delete("/products/:id", async (req, res) => {
      // req params theke id nebo
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productsCollection.deleteOne(query);
      res.send(result);
    });

    // checking ping
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`smart deals ser is running on port ${port}`);
});
