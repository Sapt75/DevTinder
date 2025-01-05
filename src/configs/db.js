const mongoose = require("mongoose");
const DB = "mongodb://admin:hzbDKouXyBs5BnhTb3dg@103.150.30.160:27017/devTinder?authSource=admin&retryWrites=true&w=majority"

async function connectDB() {
  try{
    await mongoose.connect(DB);
    console.log("Database connection established")
  }catch(err){
    console.log("Database connection error: " + err)
  }
}

module.exports = { connectDB };
