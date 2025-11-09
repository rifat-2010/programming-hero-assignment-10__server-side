const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express()
const port = 3000
app.use(cors())
app.use(express.json())




const uri = "mongodb+srv://habit-db:WAxSAyNcM1RuLQsL@cluster0.qwnp7az.mongodb.net/?appName=Cluster0";

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
    await client.connect();



    const db = client.db('habit-db')
    const habitCollection = db.collection('habits')

    // data fetching from mongodb and http://localhost:3000/ server created
    // find
    // findOne
    app.get('/habits', async(req, res) => {

      const result = await habitCollection.find().toArray();
      // console.log(result)
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





app.get('/', (req, res) => {
  res.send('Hello World')
})

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`)
})
