var express = require('express');
var router = express.Router();
var userModel=require('./users');
var postModel=require('./posts');
const passport = require('passport');
const localStrategy=require('passport-local');
const upload = require('./multer');

passport.use(new localStrategy(userModel.authenticate()))

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index',{nav:false});
});

router.get('/register', function(req, res, next) {
  res.render('register',{nav:false});
});

//first were are searching for the user who is logged in
router.get('/profile',isLoggedIn,async function(req,res,next){
  const user= await userModel
  .findOne({username:req.session.passport.user})
  .populate("posts");
  res.render("profile",{user,nav:true});
})



router.get('/show/posts',isLoggedIn,async function(req,res,next){
  const user= await userModel
  .findOne({username:req.session.passport.user})
  .populate("posts");
  res.render("show",{user,nav:true});
})

router.get('/feed',isLoggedIn,async function(req,res,next){
  const user= await userModel.findOne({username:req.session.passport.user});
  const posts= await postModel.find()
  .populate("user");
  res.render("feed",{user,posts,nav:true});
})

router.post('/createpost',isLoggedIn,upload.single('postimage'),async function(req,res,next){
  const user= await userModel.findOne({username:req.session.passport.user});
  const post= await postModel.create({
              user:user._id,
              title:req.body.title,
              description:req.body.description,
              image:req.file.filename
            });
   user.posts.push(post._id);
  await  user.save();
  res.redirect("/profile");

});

router.post('/register',function(req,res,next){
  const userData= new userModel({
    username:req.body.username,
    fullname:req.body.fullname,
    email:req.body.email
  })
  userModel.register(userData,req.body.password)
  .then(function (registereduser){
    passport.authenticate("local")(req,res,function(){
      res.redirect('/profile');
    })
  })
});

router.post('/login',passport.authenticate("local",{
    failureRedirect:"/",
    successRedirect:"/profile"
}),function(req,res,next){
});

router.get('/logout', function(req, res, next){
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

router.post('/fileupload',isLoggedIn,upload.single('image'),async function(req,res,next){
  if (!req.file) {  
        res.status(404).send('No files were uploaded');
     } 
   const user= await userModel.findOne({username:req.session.passport.user});
   user.profileImage=req.file.filename;
   await user.save();
   res.redirect('/profile');
});

router.get('/add', isLoggedIn,async function(req, res, next) {
const user= await userModel.findOne({username:req.session.passport.user});
res.render("add",{user,nav:true});
   
});

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/");
}

module.exports = router;
