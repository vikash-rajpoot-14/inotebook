const { default: mongoose } = require("mongoose");

const mongoURI = "mongodb://localhost:27017/inotebook?readPreference=primary&appName=mongoD20%25Compass20&directConnection=true&tls=false"

const connectToMongo=()=>{
  mongoose.connect(mongoURI,()=>{
    console.log("conected to mongoose");
  })
}

module.exports=connectToMongo;