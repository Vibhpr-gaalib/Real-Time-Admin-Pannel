module.exports = function(io){
let router = require("express").Router();
let mongoose = require("mongoose");
let registerSchema = require("../Models/Register");
let jwt = require("jsonwebtoken");
let auth = require("../JWT/auth");
let con2;
let con33;
let multer = require("../Multer/multer");
let upload = multer.single("uploadFile");
let csv = require("csvtojson");
let path = require("path");

io.on("connection", (socket)=>{ //handling socket io events here in this perticluar route
    socket.emit("testing","Testing here");  
   socket.on("URL", async function(url){
         con2 = await require("../OtherMDConn/Usermongod")(url,socket);
         con33 = con2;
         con2.db.stats().then((data)=>{
             socket.emit("db_stats",data);
             console.log(data);
         });
         con2.db.listCollections().toArray(function(err,names){
                socket.emit("collectionNames",names);
        });
    });
    socket.on("findCollectionData",function(CollectionName){ //receving the findCollectionData event triggered by show button
        con2.db.collection(CollectionName,function(err,collection){ //getting and finding all the data after clicked by show Button
            collection.find({}).toArray(function(err,data){
                socket.emit("foundedDataYourCollection",data);
            });
            
        })
        
    });
    socket.on("Create_Collection", function(data){
        con2.db.createCollection(data.Collection_Name, function(err,created){
            if(err) throw new Error("Not able to create the collection "+err);
            con2.db.listCollections().toArray(function(err,names){
                socket.emit("collectionNames",names);
             }); 
        })
    });
    socket.on("Add_Data_To_Collection",function(data){ //adding data to the collection
            let colData =data.Data;
            let colName = data.CollectionN;
            console.log(colName);
            con2.db.collection(colName).insert(colData,function(err,created){
                if(err) throw new Error(err);
                console.log(created);
            })
    });
    socket.on("delete_collection",(collectionName)=>{ //handling and deleting the collection in this socket event
        console.log("is the collection name "+collectionName);
        con2.db.dropCollection(collectionName,(err)=>{
             if(err) throw new Error("Not deleted");
             socket.emit("remove_from_html",collectionName);
        });
    });
});


require("dotenv").config();


router.get("/",(req,res)=>{
    res.render("Landing");
});

router.get("/Register",(req,res)=>{
    res.render("Register");
});

router.get("/login",(req,res)=>{
    res.render("Login");
});

router.get("/MainSectionin",function(req,res){ //authentication we needed for this route
    res.render("MainPage");
});

router.get("/GetUserDB/Data/Section/:amount",function(req,res){
    res.send("GetDATA");
})

router.post("/login",(req,res)=>{ //rember to add password in the database in changedFormat
    let obj = {
        Email : req.body.Email,
    }
        registerSchema.findOne(obj,function(err,founded){
            if(err){
                throw new Error("User not found")
            }else{
                let token  = jwt.sign({exp: Math.floor(Date.now() / 1000) + (60 * 60),data : founded},process.env.key);
                founded.Pass.push(token);
                founded.save();
                res.cookie('token', token, {
                    httpOnly: false,
                    secure : false
                  }).redirect("back");
            }
        })
        // 8580416557
   
});
//Post for registration here
router.post("/GetRegister",(req,res)=>{
    let registerthis = {
        Fname : req.body.Fname,
        Lname : req.body.Lname,
        Email : req.body.Email,
        Country :req.body.Country,
        State : req.body.State,
        Pincode : req.body.Pin
    }
    registerSchema.create(registerthis,function(err,created){
        if(err){
            throw new Error(err);
        }else{
           res.redirect("/login");
        }
    })
});

router.post("/uploadFileNow",upload,(req,res)=>{
    let fname = req.file.filename;
    let pp = req.file.path;
    csv().fromFile(pp).then((jsonObject)=>{
         let arr = JSON.parse(JSON.stringify(jsonObject));
        con2.db.collection(fname).insertMany(arr,function(err,created){
            if(err) throw new Error(err);
             console.log(created);
             res.redirect("back");
});
        
    })
});



return router;
}