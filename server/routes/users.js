var express = require('express');
var mUsers = require('../db/models').mUser;
var router = express.Router();
var CryptoJS = require("crypto-js");

var keySize = 256;
var ivSize = 128;
var iterations = 100;
var secret = "abcdefghijklmnopqrstuvwxyz1234567890";

/* GET users listing. */
router.get('/', function(req, res, next) {
  try {
    let page = req.query.currentPage? parseInt(req.query.currentPage) : 0;
    let page_size = req.query.currentPageSize? parseInt(req.query.currentPageSize) : 0;
    let skip = (page - 1) * page_size;
    let first_name = req.query.first_name? req.query.first_name : '';
    let last_name = req.query.last_name? req.query.last_name : '';
    let email = req.query.email? req.query.email : '';


    let pageconfig = {};
    let query = {};

    if(page && page > 0)
      pageconfig.page = page;
    if(page_size && page_size > 0)
      pageconfig.limit = page_size;
    if(skip && skip > 0)
      pageconfig.offset = skip;
    if(first_name && first_name.trim() != '')
      query.first_name = new RegExp(first_name, 'i')
    if(last_name && last_name.trim() != '')
      query.last_name = new RegExp(last_name, 'i')
    if(email && email.trim() != '')
      query.email = new RegExp(email, 'i')
    

    mUsers.paginate(query,pageconfig,(err,result) => {
      if(err) res.status(500).json({message:'cant get user list!'})
      
      result = Object.assign(result,{message:'user list'})
      res.status(200).json(result)
    }); 

  } catch (error) {
    res.status(500).json({message:'cant get user list!'})
  }
});

router.post('/', function(req, res, next) {
  try {
    let body = req.body;
    if(!body.first_name || body.first_name.trim() == '')
      res.status(400).json({message:"first name is required"});
    if(!body.last_name || body.last_name.trim() == '')
      res.status(400).json({message:"last name is required"});
    if(!body.email || body.email.trim() == '')
      res.status(400).json({message:"email is required"});
    if(!body.password || body.password.trim() == '')
      res.status(400).json({message:"password is required"});

    var encrypted = encrypt(body.password, secret);

    body.password = encrypted;

    mUsers.count({email:body.email},(err,valRes) => {
      if(err) res.status(500).json({message:err.message});

      if(valRes && valRes > 0){
        res.status(400).json({message:"email already exists"});
      }
      else{
        mUsers.create(body,(err, result) => {
          if(err) res.status(500).json({message:err.message});
    
          result = {message:"user successfully created !"}
          res.status(201).json(result);
        })
      }
    })
  } catch (error) {
    res.status(500).json({message:'cant insert user'})
  }
});

router.post('/login', function(req, res, next) {
  try {
    let body = req.body;
    if(!body.email || body.email.trim() == '')
      res.status(400).json({message:"email is required"});
    if(!body.password || body.password.trim() == '')
      res.status(400).json({message:"password is required"});

    let query = {email:body.email}

    mUsers.findOne(query,(err, result) => {
      if(err) res.status(500).json({message:err.message});

      if(!result)
        res.status(400).json({message:"cant find user!"});
      else{
        let decryptps = decrypt(result.password,secret).toString(CryptoJS.enc.Utf8);
        
        if(decryptps != body.password){
          res.status(400).json({message:"wrong password!"});
        }
        else{
          res.status(200).json(result);
        }
      }
    })
   
  } catch (error) {
    res.status(500).json({message:'cant get user list!'})
  }
});


function encrypt (msg, pass) {
  var salt = CryptoJS.lib.WordArray.random(128/8);
  
  var key = CryptoJS.PBKDF2(pass, salt, {
      keySize: keySize/32,
      iterations: iterations
    });

  var iv = CryptoJS.lib.WordArray.random(128/8);
  
  var encrypted = CryptoJS.AES.encrypt(msg, key, { 
    iv: iv, 
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CBC
    
  });
  
  var transitmessage = salt.toString()+ iv.toString() + encrypted.toString();
  return transitmessage;
}

function decrypt (transitmessage, pass) {
  var salt = CryptoJS.enc.Hex.parse(transitmessage.substr(0, 32));
  var iv = CryptoJS.enc.Hex.parse(transitmessage.substr(32, 32))
  var encrypted = transitmessage.substring(64);
  
  var key = CryptoJS.PBKDF2(pass, salt, {
      keySize: keySize/32,
      iterations: iterations
    });

  var decrypted = CryptoJS.AES.decrypt(encrypted, key, { 
    iv: iv, 
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CBC
    
  })
  return decrypted;
}

module.exports = router;
