const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = 5000;


// Setup middleware
app.use(express.json());
app.use(cors());

// User: Imrancu
// Pass: KJeEPE7l7qDmfkAh


const uri = "mongodb+srv://Imrancu:KJeEPE7l7qDmfkAh@cluster0.2snon.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();

        const notesCollection = client.db("notesTaker").collection("notes");

        // Get api to read all notes
        // http://localhost:5000/notes
        app.get('/notes', async (req, res) => {
            const q = req.query;
            const cursor = notesCollection.find({});
            const result = await cursor.toArray();
            res.send(result);
        });

        // Create notesTaker
        // http://localhost:5000/note
        app.post("/note", async (req, res) => {
            const data = req.body;
            console.log("From post api", data);
            const result = await notesCollection.insertOne(data)
            res.send(result)

        });

        // Update notesTaker
        // http://localhost:5000/note/62767e6d1e7e0585bdd14ecd
        app.put("/note/:id", async (req, res) => {
            const id = req.params.id;
            const data = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };

            const updateDoc = {
                $set: {
                    userName: data.userName,
                    textData: data.textData
                },
            };
            const result = await notesCollection.updateOne(filter, updateDoc, options);
            res.send(result);
        })

        // Delete notesTaker
        // http://localhost:5000/note/62767e6d1e7e0585bdd14ecd
        app.delete('/note/:id', async (req, res)=>{
            const id = req.params.id;
            const filter = {_id: ObjectId(id)};

            const result = await notesCollection.deleteOne(filter);
            res.send(result);

        })

        console.log("db is connected");

    }
    finally {

    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send("Hello Notes Taker.")
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})