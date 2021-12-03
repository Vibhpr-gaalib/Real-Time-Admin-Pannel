let mongoose = require("mongoose");
module.exports =  mongoose.createConnection("mongodb://localhost/AdminPannel",{useUnifiedTopology: true,useNewUrlParser: true},()=>{
    console.log("Connected with the database");
});
 