const mongoose=require('mongoose')
const schema=mongoose.Schema;
const plm=require('passport-local-mongoose')

mongoose.connect("mongodb://127.0.0.1:27017/pinmongo")

const userSchema=new schema({
  username:String,
  email:String,
  fullname:String,
  password:String,
  profileImage:String,
  contact:Number,
  boards:{
   type:Array,
   default:[] 
  },
  posts:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:'post'
  }]
})

userSchema.plugin(plm);

module.exports=mongoose.model("user",userSchema);