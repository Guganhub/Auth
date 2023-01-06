const bcrypt= require('bcryptjs')
const jwt = require('jsonwebtoken');
const { token } = require('morgan');
const SALT=10;
const secretKey='sdhfsidhfisdh'

const hashPassword= async(password)=>{
    let salt= await bcrypt.genSalt(SALT)
    let hash = await bcrypt.hash(password,salt)
    return hash


}

const hashCompare = async(password, hashedPassword)=>{
 return bcrypt.compare(password,hashedPassword)
}
const createToken= async(payload)=>{
    let token = await jwt.sign(payload,secretKey,{expiresIn:'1m'})
    return token
}

const decodeToken= async(token)=>{
    let data = await jwt.decode(token)
   
    return data
}

const validate=async (req,res,next)=>{
    if(req.headers.authorization){
        let token = req.headers.authorization.split(" ")[1]
        let data = await decodeToken(token)
       if(Math.round(Date.now()/1000)<=data.exp){
        next()
       }
       else{
        res.status(401).send({
            message:"Token expired"
        })
       }
    }
    else{
        res.status(400).send({
            message:"No token found"
        })
    }
}

const roleAdmin = async(req,res,next)=>{
    if(req.headers.authorization){
        let token = req.headers.authorization.split(" ")[1]
        let data = await decodeToken(token)
        if(data.role==='admin'){
            next()
        }
        else{
            res.status(400).send({
                message:"Only admin can access"
            })
        }
    }
}

module.exports={hashPassword,hashCompare,createToken,decodeToken,validate,roleAdmin}