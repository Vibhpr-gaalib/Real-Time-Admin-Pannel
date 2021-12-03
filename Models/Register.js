let con = require("../Mongodb/mongodb");


let mongoose = require("mongoose")
const schema = con.model("register", new mongoose.Schema({
    Fname :{
        type:String,
        required:true
    },
    Lname :{
        type:String,
        required:true
    },
    Email :{
        type:String,
        required:true,
    },
    Pass :{
        type:Array,
        required:true
    },
    Country :{
        type:String,
        required:true,
    },
    State :{
        type:String,
        required:true,
    },
    Pincode :{
        type:String,
        required:true,
    },
    Links :{
        type:Array,
    }
}),"register"
);
module.exports = schema;
