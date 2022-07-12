require("dotenv").config({ path: "./config.env" });
const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;
const recordRoutes = express.Router();
let dataarray = []
const Firestore = require('@google-cloud/firestore');

const db = new Firestore({
  projectId: 'dreiki-webground',
  keyFilename: '/home/denny/react-test/react-todo-back/dreiki-webground-e48b6eec3bea.json',
});

async function getdatafirestore() {
  const snapshot = await db.collection('todo-items').get();
  snapshot.forEach((doc) => {
    console.log(doc.id, '=>', doc.data());
    dataarray.push(doc.data())
  });
  console.log(dataarray)
}

app.use(cors());
app.use(express.json());
app.get('/', async (req, res) => {
  await getdatafirestore()
  res.send(dataarray)
});

app.listen(port, () => {
  // perform a database connection when server starts
  console.log(`Server is running on port: ${port}`);
});