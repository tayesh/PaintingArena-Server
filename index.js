const express = require('express')
const cors = require('cors')
require('dotenv').config();
const app = express()

const port = process.env.port || 5000


app.use(cors());
app.use(express.json())

// f7jEe0PS8546vejl
// paintingarena




const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1xhb2as.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // await client.connect();
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });

    const paintingCollection = client.db('paintingdb').collection('painting');

    app.get('/paintings', async (req, res) => {
      const cursor = paintingCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })
    app.get('/paintings/:id', async (req, res) => {
      const id = req.params.id;

      try {
        const query = { _id: new ObjectId(id) };
        const painting = await paintingCollection.findOne(query);

        if (!painting) {
          return res.status(404).send('Painting not found');
        }

        res.send(painting);
      } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Internal Server Error");
      }


    })
    app.get('/subcategory/:sub',async(req,res)=>{
      const sub =req.params.sub;
      const cursor = paintingCollection.find();
      const result = await cursor.toArray();
      const filteredResult = result.filter(item=>item.subcategory_name===sub.split('_').join(' '));
      console.log(sub);
      res.send(filteredResult);

    })
    app.post("/paintings", async (req, res) => {
      const newPaintings = req.body;
      console.log(newPaintings);
      const result = await paintingCollection.insertOne(newPaintings);
      res.send(result);

    })
    app.delete("/paintings/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await paintingCollection.deleteOne(query)
      res.send(result);
      console.log(id);
    })
    app.put("/paintings/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id)
      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true }
      const updatedPainting = req.body
      const painting = {
        $set: {
          item_name: updatedPainting.item_name,
          image: updatedPainting.image,
          short_description: updatedPainting.short_description,
          price: updatedPainting.price,
          rating: updatedPainting.rating,
          processing_time: updatedPainting.processing_time,
          subcategory_name: updatedPainting.subcategory_name,
          customization: updatedPainting.customization,
          stock_status: updatedPainting.stock_status

        }
      }
      const result = await paintingCollection.updateOne(filter,painting,options);
      res.send(result);

    })


    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})