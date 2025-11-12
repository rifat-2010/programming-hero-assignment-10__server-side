const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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


    // fetching one data from mongodb and for Details page of every single card data.
    // findOne
    app.get('/habits/:id', async(req, res) => {

      const {id} =  req.params;
      // console.log(id)
      const result = await habitCollection.findOne({_id: new ObjectId(id)});
      res.send({
      success: true,
      result
      })
    })

    


     // post method //for ADD_Habit page
    //  insertOne
   //  insertMany
   
   app.post('/habits', async (req, res) => {
     const data = req.body
        // console.log(data)
        const result = await habitCollection.insertOne(data)
        res.send({
            success: true,
            result
        })
   })




   //PUT //For Update_Habit __ page
   //updateOne
   //updateMany

   app.put('/habits/:id', async (req, res) => {
        const {id} = req.params
        const data = req.body
        // console.log(id)
        // console.log(data)
        const objectId = new ObjectId(id)
        const filter = {_id: objectId}
        const update = {
            $set: data
        }

       const result  = await habitCollection.updateOne(filter, update)


       res.send({
        success: true,
        result
       })
   })




    // delete //for card delet by clicking the delet button of card
   // deleteOne
   // deleteMany
   app.delete('/habits/:id', async(req, res) => {
      const {id} = req.params
        //    const objectId = new ObjectId(id)
        // const filter = {_id: objectId}
      const result = await habitCollection.deleteOne({_id: new ObjectId(id)})

      res.send({
        success: true,
        result
      })
   })




  // latest 6 data 
  // get
  // find
  app.get('/latest-habits', async (req, res) => {
  const result = await habitCollection.find().sort({createdAt: 'desc'}).limit(6).toArray()

    console.log(result)
    res.send(result)
  })



  // for my-habits page
  app.get("/my-habits", async(req, res) => {
      const email = req.query.email
      const result = await habitCollection.find({userEmail: email}).toArray()
      res.send(result)
    })




  //for Mark Complete button in Details_and_MyHabit page 
app.patch("/habits/:id/complete", async (req, res) => {
  const id = req.params.id;
  const today = new Date().toISOString().split("T")[0];

  const habit = await habitCollection.findOne({ _id: new ObjectId(id) });

  if (!habit) {
    return res.status(404).send({ message: "Habit not found" });
  }

  const history = habit.completionHistory || [];
  const alreadyCompleted = history.includes(today);

  if (alreadyCompleted) {
    return res.send({ message: "Already completed today" });
  }

  const updatedHistory = [...history, today];

  let streak = 1;
  for (let i = updatedHistory.length - 2; i >= 0; i--) {
    const prev = new Date(updatedHistory[i]);
    const next = new Date(updatedHistory[i + 1]);
    const diff = Math.round((next - prev) / (1000 * 60 * 60 * 24));
    if (diff === 1) streak++;
    else break;
  }

  await habitCollection.updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        completionHistory: updatedHistory,
        currentStreak: streak
      }
    }
  );

  res.send({
    message: "Habit completed",
    currentStreak: streak,
    completionHistory: updatedHistory
  });
});



// for search bar in Public_Habits page
app.get("/search", async (req, res) => {
  const search = req.query.search || "";

  const filter = {
    title: { $regex: search, $options: "i" }
  };

  const result = await habitCollection.find(filter).toArray();
  res.send(result);
});


  

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);





app.get('/', (req, res) => {
  res.send('Hello World From Rifatuzzaman Rifat!')
})

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`)
})
