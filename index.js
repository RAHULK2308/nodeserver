const bodyParser = require('body-parser');
const express=require('express');
const userData=require('./model/usermodel');
const argon2 = require('argon2');
const jwt=require('jsonwebtoken')

var app=new  express();
app.use(bodyParser.json());


//inserting user data
app.post('/insert', async function(req,res){
    if(req?.body){
        return res.status(401).send('no data')
    }
    var hash;
    //creating the hash
    try {
         hash = await argon2.hash(req.body.password);
        
      } catch (err) {
        console.log(err)
      }
      
    var user={
        fullname:req.body.fullname,
        email:req.body.email,
        password:req.body.password,
        hash:hash
    }
   
    
    var newuser=new userData(user);
    newuser.save();
    let payload = {subject: req.body.fullname+req.body.password}
    let token = jwt.sign(payload, 'secretKey')
    res.status(200).send({token})
   
})

//middleware for verifiying token
function verifyToken(req, res, next) {
    if(!req.headers.authorization) {
      return res.status(401).send('Unauthorized request')
    }
    let token = req.headers.authorization.split(' ')[1]
    if(token === 'null') {
      return res.status(401).send('Unauthorized request')    
    }
    let payload = jwt.verify(token, 'secretKey')
    if(!payload) {
      return res.status(401).send('Unauthorized request')    
    }
    req.userId = payload.subject
    next()
  }

  //sign out
  app.post('/signout',verifyToken,function(res,req){
    res.send('successfully log out')
  })


app.listen(3000,()=>{
    console.log('listening port 3000')
})