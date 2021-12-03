module.exports = (port)=>{
  
    let express = require("express"),
     app = express(),
     parser = require("body-parser"),
     server =  require("http").createServer(app),
     io  = require("socket.io")(server),
     jwt = require("jsonwebtoken"),
     mongoose = require("mongoose"),
     cookieparser =  require("cookie-parser");
     app.use(cookieparser());
     
     
    //getting routes
    let NormalRoutes = require("./Routes/NormalRoutes")(io); //Normal Route and also passing the io variable instacne
    //making mongoose connection here for my personal app
    let mongodb_file = require("./Mongodb/mongodb");
    

     //setting app use cases here 
     app.set("view engine","ejs");
     app.use(express.static("Public"));
     app.use(parser.urlencoded({extended:false}));
     app.use(NormalRoutes);

     //socket io event handling here 
    io.on("connection",(socket)=>{
        socket.emit("DB","Connected ho bhai saheb ap to");
    });

    

    //server creation here
     server.listen(port,()=>{
         console.log("Go to port number "+port);
     });

}