const mongoose=require('mongoose')
const schema=mongoose.Schema;


const postSchema=new schema({
  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'user'
  },
  title:String,
  description:String,
  image:String
});


module.exports=mongoose.model("post",postSchema);