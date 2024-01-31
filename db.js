const mongoose = require('mongoose');
const dotenv=require('dotenv');
dotenv.config();

const USERNAME = process.env.DB_USERNAME;
const PASSWORD = process.env.DB_PASSWORD;
const mongoURI = `mongodb+srv://${USERNAME}:${PASSWORD}@book.3uirky8.mongodb.net/`;
// const mongoURI = `mongodb+srv://EvenBook:EvenBook@book.3uirky8.mongodb.net/`;

const connectToMongo=()=>{
    mongoose.connect(mongoURI,()=>{
        console.log("Connected to mongo Successfully");
        
    })
}
module.exports=connectToMongo