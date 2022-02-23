const express = require('express');
const router = express.Router();

router.get('/hi', function(req,res){
    let arr = [1,2,3,5,6,7]
    let sum =0
    for(let i=0; i<arr.length; i++){
        sum +=i
    }
    val = sum
    res.send(val)
})
module.exports = router;