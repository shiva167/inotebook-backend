const express = require('express');
const User= require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var fetchuser = require('../Middleware/fetchuser.js');
const dotenv = require('dotenv')
dotenv.config();
const JWT_SECRET = `${process.env.NEW_JWT_SECRET}`;  //isse webtoken ko sign karenge
var jwt = require('jsonwebtoken');




/// Route 1 : Create a new User using : POST "/api/auth/createuser". No login required
const router = express.Router();
router.post('/createuser',[

 body('name','Enter a valid name').isLength({min:3}),
 body('password','Enter a valid password').isLength({min:5}),
 body('email','Enter a valid email').isEmail()
],
async (req,res)=>{
  // obj={
  //   a:'there are some cheapless people',
  //   number: 23
  // }         
  // res.json([]);
// console.log(req.body);//request
// const user = User(req.body);
// user.save();
// res.send(req.body);
// res.send("Hello"); //response
///if there are error return bad request and the errors 
let success=false;
const errors = validationResult(req);
if(!errors.isEmpty()){
  return res.status(400).json({errors:errors.array()});
}
try { 
//check weather user with this email exist already
let user= await User.findOne({email:req.body.email})
// console.log(user);
if(user){
 return res.status(400).json({success,error:"Sorry a user with this email already exists"})
}
const salt = await bcrypt.genSalt(10);
const secPass =await bcrypt.hash(req.body.password,salt);
user  = await  User.create({
    name : req.body.name,
  password:secPass,
  email:req.body.email

});
const data= {
  user:{
  id :user.id
  }
}
const authtoken=jwt.sign(data,JWT_SECRET);
success= true;
// console.log(jwtData);
res.json({success,authtoken});
} catch (error) {
 console.error(error.message); 
 res.error(500).send("Some error occured");
}
//.then(user=>res.json(user)).catch(err=>{console.log(err)
// res.json({error:'Please enter unique value of email',message:err.message})})
});
// res.send(req.body);






// Route 2 :Authenticate a new User using : POST "/api/auth/login". No login required
router.post('/login',[
  
  body('email','Enter a valid email').isEmail(),
  body('password','password can not be blank').exists()
],
async (req,res)=>{
  let success=false;
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(400).json({errors:errors.array()});
  }
  try{
  const {email,password}=req.body;
let user= await User.findOne({email});
if(!user){
  success=false;
  return res.status(400).json({error:"Please try to login with correct credentials"});
}
const passwordCompare= await bcrypt.compare(password,user.password);
if(!passwordCompare){
  success=false;
  return res.status(400).json({success,error:"Please try to login with correct credentials"}); 
}
const data={
  user:{
    id:user.id
  }
}
const authtoken=jwt.sign(data,JWT_SECRET);
success=true;
res.json({success,authtoken});

}
catch(error){
  console.error(error.message); 
  res.status(500).send("Internal server error") 
}
});




// Route 3 : Get loggedin User Details using : POST "/api/auth/getuser". No login required
router.post('/getuser',fetchuser,
async (req,res)=>{
  
try{
    userid = req.user.id;
  const user = await User.findById(userid) ;
  res.send(user);

}catch(error){
  console.error(error.message); 
  res.status(500).send("Internal server error") 
}
});
  module.exports=router 
