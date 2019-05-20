const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const dburl = "mongodb://new-user_0:553744@monitoringusersverify-shard-00-00-fjxrl.azure.mongodb.net:27017,monitoringusersverify-shard-00-01-fjxrl.azure.mongodb.net:27017,monitoringusersverify-shard-00-02-fjxrl.azure.mongodb.net:27017/deviceMsg?ssl=true&replicaSet=monitoringUsersVerify-shard-0&authSource=admin&retryWrites=true";

mongoose.connect(dburl, { useNewUrlParser: true ,useCreateIndex: true,})
.then(() => console.log("Mongodb of deviceMsg connected"))
.catch(err => console.log(err));

let deviceSchema = mongoose.Schema({
    id: String,
    status: Boolean,
    type: String,
    isSlow: Boolean,
    isForward: Boolean
});

let Devices = mongoose.model('status', deviceSchema); 

router.post('/setDevice', function(req, res, next){
   const target = {
       id: req.body.id
   }
   console.log(req.body);
   Devices.findOneAndUpdate(target, req.body, function(err, device){
    if(err) throw err;
    if(device){
        res.status(200).send('succeed');
        console.log(device);
    }else{
        res.status(202).send('operation failed')
    }
   })
})

router.get('/find', function(req, res){
    Devices.find({type: 'switch'}, function(err, data){
        if(err) throw err;
        res.status(200).send(data);
    })
})

router.get('/read', function(req, res){
    Devices.find({type: 'sensor'}, function(err, data){
        if(err) throw err;
        console.log(data);
        res.status(200).send(data[0]);
    })
})

module.exports = router;