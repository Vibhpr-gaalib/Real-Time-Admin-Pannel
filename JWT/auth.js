let jwt = require("jsonwebtoken");
module.exports = function(req,res,next){
    let token = req.cookies.token;
    if(!token){
        res.redirect("/Register");
    }else{
        jwt.verify(token,process.env.key,(err,verified)=>{
            if(err){
                throw new Error(err)
            }else{
                req.user = verified;
                next();
            }
        })
    }

}