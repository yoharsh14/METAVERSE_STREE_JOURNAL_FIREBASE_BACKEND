const functions = require("firebase-functions");
const express = require("express");
const app = express();
const auth = require("./routes/users");
const article = require("./routes/article");
require("dotenv").config();
const db = require("./firebase");
const cors = require("cors");
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
// ROUTES
app.get("/", (req, res) => {
  res.status(200).send("Helllooo World!!");
});

app.use("/auth", auth);
app.use("/article", article);

//  READ
//  --GET ROUTE
app.get("/read", async (req, res) => {
  try {
    const query = db.collection("products");
    const response = [];
    const data = await query.get();
    const docs = data.docs;
    docs.map((element) => {
      const currData = element.data();
      console.log(element.id);
      const selectedItem = {
        id: element.id,
        name: currData.name,
        description: currData.description,
        price: currData.price,
      };
      response.push(selectedItem);
    });
    res.status(200).json(response);
  } catch (e) {
    return res.status(500).send("Error in getting the data");
  }
});
app.get("/read/:id", async (req, res) => {
  try {
    const document = db.collection("products").doc(req.params.id);
    const product = await document.get();
    const response = product.data();
    res.status(200).json(response);
  } catch (e) {
    return res.status(500).send("Error in getting the data");
  }
});

//  CREATE
//  --POST ROUTE
app.post("/create", (req, res) => {
  const { id, name, description, price } = req.body;
  const createDBController = async () => {
    try {
      await db
        .collection("products")
        .doc("/" + id + "/")
        .create({
          name: name,
          description: description,
          price: price,
        });
      res.status(200).send("Created");
    } catch (e) {
      console.error(e);
      console.log("Error in Create Route");
      res.status(500).send("Error Occured in creating the product doc");
    }
  };
  createDBController();
});

//  UPDATE
//  ---PUT

app.put("/update/:id", async (req, res) => {
  try {
    const { name, description, price } = req.body;
    const id = req.params.id;
    const document = db.collection("products").doc(id);
    await document.update({
      description: description,
      name: name,
      price: price,
    });
    return res.status(200).send("Update successfully");
  } catch (e) {
    console.error(e);
    return res.status(500).send("Error");
  }
});
//  DELETE
app.delete("/delete/:id", async (req, res) => {
  try {
    const document = db.collection("products").doc(req.params.id);
    await document.delete();
    return res.status(200).send("Deleted successfully");
  } catch (e) {
    console.log(e);
    return res.status(500);
  }
});
// Export the api to firebase cloud functions
exports.app = functions.https.onRequest(app);
