let multer = require("multer");
let storage = multer.diskStorage({
    filename : function(req,file,cb){
        cb(null,file.fieldname+"_"+Date.now()+"_"+file.originalname);
    },
    destination:function(req,file,cb){
        cb(null,'./Uploads');
    }
});
let upload = multer({storage : storage});
module.exports = upload;