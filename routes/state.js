var express = require('express');
var router = express.Router();
var db=require('./db')

/* GET home page. */
router.get('/fetchallstates', function(req, res, next) {
  db.query("select * from states",(error,result)=>{
    if(error) res.status(500).json({status:false})
    else res.status(200).json({status:true,result:result})
  })
});

router.get('/fetchallcities', function(req, res, next) {
    db.query("select * from cities where state_id=?",[req.query.stateid],(error,result)=>{
      if(error) res.status(500).json({status:false})
      else res.status(200).json({status:true,result:result})
    })
  });

module.exports = router