var express = require('express');
var router = express.Router();
var mongoose= require('mongoose')
const {dbUrl}= require('./../dbConfig')
const {userModel}= require('./../Schema/UserSchema')
const {hashPassword,hashCompare,createToken,decodeToken,validate,roleAdmin}= require('./../common/auth')

mongoose.connect(dbUrl)
/* GET users listing. */
router.post('/signup',async(req,res)=>{
  try{
    let user= await userModel.findOne({email:req.body.email})
    if(!user){
       req.body.password = await hashPassword(req.body.password)
      let user = await userModel.create(req.body)
      console.log(user)
      res.status(201).send({
        message:"User registered"
      })
    }
    else{
      res.status(400).send({
        message:`User with ${req.body.email} already exists`
      })
    }

  }
  catch(error){
    res.status(500).send({
      message:"Internal Server Error",error
    })
  }
})

router.post('/login',async(req,res)=>{
  try{
    let user= await userModel.findOne({email:req.body.email})
    if(user){

      if(await hashCompare(req.body.password,user.password)){
        let token = await createToken({firstName:user.firstName,lastName:user.lastName,email:user.email,role:user.role})
      res.status(201).send({
        message:"login success",token
      })
    }
    else{
      res.status(400).send({
        message:"invalid password"
      })
    }
    }
    else{
      res.status(400).send({
        message:`User with ${req.body.email} does not exists`
      })
    }

  }
  catch(error){
    res.status(500).send({
      message:"Internal Server Error",error
    })
  }
})


router.get('/all', validate,roleAdmin, async(req,res)=>{
  try{
    console.log(req.headers.authorization)
    let users= await userModel.find()
    res.status(200).send({
      data:users
    })
  }
  catch(error){
    res.status(500).send({
      message:"Internal Server Error"
    })
  }
})
router.delete('/:id',async(req,res)=>{
  try{
    let user= await userModel.findById({_id:req.params.id})
    if(user){
      await userModel.deleteOne({_id:req.params.id})
    res.status(200).send({
      message:"User Deleted successfully"
    })
  }
  else{
    res.status(400).send({
      message:"invalid id"
    })
  }

  }
  catch(error){
    res.status(500).send({
      message:"Internal Server Error"
    })
  }
})

module.exports = router;
