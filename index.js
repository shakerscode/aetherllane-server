require("dotenv").config();
const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2rwge.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const run = async () => {
  try {
    const db = client.db("bruno-membership-db");
    const blogCollection = db.collection("blogs");

    // all Blogs
    app.get("/blogs", async (req, res) => {
      const cursor = blogCollection.find({});
      const product = await cursor.toArray();

      res.send({ status: true, data: product });
    });

    //single blog
    app.get("/blog/:id", async (req, res) => {
      const id = req.params.id;
      const result = await blogCollection.findOne({ _id: ObjectId(id) });
      res.send(result);
    });

    //update blog
    app.patch("/blog/:id", async (req, res) => {
      const id = req.params.id;
      const updateData = req.body;
      console.log(updateData);
      try {
        const result = await blogCollection.updateOne(
          { _id: ObjectId(id) },
          { $set: updateData }
        );
        res.send({ status: true, message: "Blog updated successfully" });
      } catch (error) {
        res.status(500).send({ status: false, message: "Error updating blog" });
      }
    });

    //Posting
    app.post("/blogs", async (req, res) => {
      const newBlogData = req.body; // Assuming the new blog data is sent in the request body

      try {
        const result = await blogCollection.insertOne(newBlogData);
        res.send({ status: true, message: "Blog posted successfully" });
      } catch (error) {
        res.status(500).send({ status: false, message: "Error posting blog" });
      }
    });

    //deleting

    app.delete("/blog/:id", async (req, res) => {
      const id = req.params.id;

      try {
        const result = await blogCollection.deleteOne({ _id: ObjectId(id) });
        if (result.deletedCount === 1) {
          res.send({ status: true, message: "Blog deleted successfully" });
        } else {
          res.status(404).send({ status: false, message: "Blog not found" });
        }
      } catch (error) {
        res.status(500).send({ status: false, message: "Error deleting blog" });
      }
    });

    
  } finally {
  }
};

run().catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Please go to the /blogs route for data");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
