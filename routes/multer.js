const multer=require('multer');
const {v4:uuidv4}=require('uuid');
const path=require('path');

//disk storage code we can get directly from "npm multer"
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/images/uploads');
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = uuidv4();
      cb(null,uniqueSuffix+path.extname(file.originalname));
    }
  })
  
  const upload = multer({ storage: storage })
  module.exports=upload;