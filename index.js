require('dotenv').config();
import cors from 'cors';
import express from 'express';
import { MongoClient, ObjectId, ServerApiVersion } from 'mongodb';

const app = express();
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wn4h1rl.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const run = async () => {
  try {
    const db = client.db('bruno');
    const blogCollection = db.collection('blogs');

    // all products
    app.get('/products', async (req, res) => {
      const cursor = blogCollection.find({});
      const product = await cursor.toArray();

      res.send({ status: true, data: product });
    });

    app.get('/product/:id', async (req, res) => {
      const id = req.params.id;

      const result = await blogCollection.findOne({ _id: ObjectId(id) });
      res.send(result);
    });

  } finally {
  }
};

run().catch((err) => console.log(err));

app.get('/', (req, res) => {
  res.send('Please go to the /blogs route for data');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
