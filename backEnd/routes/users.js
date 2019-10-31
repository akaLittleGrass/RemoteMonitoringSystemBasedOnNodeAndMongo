const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const dburl = "mongodb://new-user_0:553744@monitoringusersverify-shard-00-00-fjxrl.azure.mongodb.net:27017,monitoringusersverify-shard-00-01-fjxrl.azure.mongodb.net:27017,monitoringusersverify-shard-00-02-fjxrl.azure.mongodb.net:27017/userInfo?ssl=true&replicaSet=monitoringUsersVerify-shard-0&authSource=admin&retryWrites=true";
const jwt = require('jsonwebtoken');
const secret = 'salt';

mongoose.connect(dburl, { useNewUrlParser: true })
.then(() => console.log("Mongodb of users connected"))
.catch(err => console.log(err));

const userSchema = mongoose.Schema({
  userName: String,
  passWord: String,
  type: String
});
const User = mongoose.model('User', userSchema);

const found = function(res, users) {
  res.status(200).send({
    result: 'found',
    type: users[0].type
  });
}
const notFound = function(res){
  res.status(200).send({
    result: 'notFound',
    type: ''
  });
}

/* GET users listing. */

router.post('/insert', function(req, res, next){
  const data = req.body;
  console.log(data);
  User.find(data, function(err, users){
    if(err) throw err;
    if(!users.length){
      const newUser = User({
        userName: data.userName,
        passWord: data.passWord,
        type: data.type,
      })
      newUser.save(function(err){
        if (err) throw err;
        console.log('User created successfully');
        res.status(200).send({
          result: 'succeed'
        });
      })
    }else{
      found(res, users)
    }
  })  
});

router.post('/login', function(req, res, next){
  const data = req.body;
  console.log(data);
  User.find(data, function(err, users){
    if(err) throw err;
    console.log(users);
    if(!users.length){
      notFound(res);
      return
    }
    const tokenData = {
      userName: users[0].userName,
      type: users[0].type
    }
    const token = jwt.sign(tokenData, secret, {
      expiresIn : 60*60*12
    });
    res.status(200).send({
      result: 'found',
      type: users[0].type,
      token: token
    })
  })
})

router.use('/verify', function(req, res){
  const token = req.body.token || req.query.token || req.headers['token'];
  console.log(token);
  if (token) {      
    jwt.verify(token, secret, function(err, decoded) {      
        if (err) {
          return res.json({ success: false, message: '无效的token.' });    
        } else {
          const tokenData ={
            userName: decoded.userName,
            type: decoded.type
          };
          const token = jwt.sign(tokenData, secret, {
            expiresIn : 60*60*5
          });
          res.status(200).send({
            ...tokenData,
            token: token
          })
      }
    });
  } else { 
    return res.status(403).send({ 
        success: false, 
        message: 'no token.' 
    });
  }
})

router.post('/delete', function(req, res, next){
  const data = req.body;
  User.findOneAndRemove(data, function(err, users){
    if(err) throw err;
    if(users){
      console.log('User deleted successfully');
      res.status(200).send({
        result: 'succeed'
      });
    }else{
      notFound(res);
    }
  })
})

router.post('/update', function(req, res, next){
  const data = req.body;
  console.log(data);
  const target = {
    userName: data.userName,
  }
  User.findOneAndUpdate(target, data, function(err, users){
    if(err) throw err;
    if(users){
      res.status(200).send({
        result: 'succeed'
      });
    }else{
      notFound(res);
    }
  })
})

module.exports = router;
