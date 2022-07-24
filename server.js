// MONGO DB TESTING BACKEND, Not Working with new frontend commit


const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config({ path: "./config.env" });
const port = process.env.PORT || 5000;
app.use(cors());
const recordRoutes = express.Router();

app.use(express.json());
app.use(require("./routes/record"));
// get driver connection
const dbo = require("./db/conn");

// app.post('/routes/add',(request,response) => {
// //code to perform particular action.
// //To access POST variable use req.body()methods.

// console.log(request.body[0]);
// response.end('It worked!');
// });

app.get('/', (req, res) => {
    res.send('TEST Get Success')
});

app.listen(port, () => {
  // perform a database connection when server starts
  dbo.connectToServer(function (err) {
    if (err) console.error(err);
 
  });
  console.log(`Server is running on port: ${port}`);
});