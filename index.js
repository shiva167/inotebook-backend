const { default: mongoose } = require('mongoose');
const connectToMongo = require('./db');
const express = require('express');
const dotenv = require('dotenv');
mongoose.set('strictQuery',true);
dotenv.config({ path: '../.env'});
connectToMongo();
  const app = express()
  const port =process.env.APP_PORT|| 5100;
  var cors = require('cors')
  app.use(cors())
  // const port = 5000;
  console.log("Here is the port no :--------")
  console.log(process.env.APP_PORT)
  app.get('/', (req, res) => {
    res.status(200).json({"message": "Success"})
  })
  app.get('/api/v1/login', (req, res) => {
    res.send('Hello Login page Open!')
  })
  app.get('/api/v1/signUp', (req, res) => {
    res.send('Hello SignUp page Open!')
  })
  app.use(express.json()) ///middleware
  //Available routers  
  app.use("/api/auth",require('./routes/auth'));  
  app.use("/api/notes",require('./routes/notes')); 
  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })
  
  // console.log("You are a Hero");
