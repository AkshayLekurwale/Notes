const mongoose = require('mongoose');

const mongoURI = "mongodb://localhost:27017/inotebook?directConnection=true"

const connectToMongo = async () => {

        await mongoose.connect(mongoURI, {});
        console.log("Connected to MongoDB successfully");
}

module.exports = connectToMongo;



