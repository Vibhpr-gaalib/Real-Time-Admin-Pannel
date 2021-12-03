
module.exports = async function(URL,socket){
    let mongoose = require("mongoose");
    let db ;
        try{
            await mongoose.connect(URL,{useUnifiedTopology: true,useNewUrlParser: true});
  function call(){
                console.log("Connected With the User DataBase");
                socket.emit("connected_user","Connected With your Database");
                    db  =  mongoose.connection;
                    return db;
            }
        }catch(e){
            console.log(e)
        }
   
    return call(); // returning the connection instance here
    
}
