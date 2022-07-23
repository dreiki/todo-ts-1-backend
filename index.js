require("dotenv").config({ path: "./config.env" });
const express = require("express");
const recordRoutes = express.Router();
const cors = require("cors");
const port = process.env.PORT || 5000;
const Firestore = require('@google-cloud/firestore');
let dbresponsedata
const app = express();
app.use(cors());
app.use(express.json());

const db = new Firestore({
  projectId: 'dreiki-webground',
  keyFilename: '/home/denny/react-test/react-todo-back/dreiki-webground-e48b6eec3bea.json',
});

async function getdatafirestore(username='dennyrizram') {
  dbresponsedata = {'data':[],'date':''}
  const snapshot = await db.collection('todo-items').doc(username).collection('data').get();
  snapshot.forEach((doc) => {
    dbresponsedata.data.push(doc.data())
  });
  await db.collection('todo-items').doc(username).get().then((d)=>{dbresponsedata.date = d.data()["date"]})
  console.log(dbresponsedata)
}

async function deletedatafirestore(username='dennyrizram') {
  const snapshot  = await db.collection('todo-items').doc(username).collection('data').get();
  const batchSize = snapshot.size
  console.log(batchSize)
  if (batchSize === 0) {
    // When there are no documents left, we are done
    return;
  }
  
  const batch = db.batch();
  snapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });
  await batch.commit();
}

async function updatedatafirestore(username,date,data) {
  const newdate = {'date':date}
  await db.collection('todo-items').doc(username).set(newdate)
  if (data.length > 0){
    await data.forEach((d) => {
      db.collection('todo-items').doc(username).collection('data').doc(d.id.toString()).set(d)
    })
  }
}

app.post('/get', async (req, res) => {
  console.log("NEW GET REQUEST")
  console.log(req.body.user)
  await getdatafirestore(req.body.user).catch((d)=>{console.error(d)})
  res.send(dbresponsedata)
});

app.post('/update', async (req, res) => {
  console.log("NEW UPDATE REQUEST")
  console.log(req.body)
  await deletedatafirestore(req.body.user).then(()=> updatedatafirestore(req.body.user,req.body.date,req.body.data)).catch((d)=>{console.error(d)})
  res.send({"status":"Done"})
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});