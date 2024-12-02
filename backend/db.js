const mongoose = require('mongoose')
const mongoURI = "mongodb://localhost:27017/iNotebook"

const connectToMongo = async()  =>{
    try {
        await mongoose.connect(mongoURI);
        console.log("Connected to MongoDB")
        
    } catch (error) {
        console.log("Error connecting to MongoDB:",error);
        process.exit(1)
    }
    
}

module.exports  = connectToMongo;