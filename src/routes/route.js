const express = require('express');
const router = express.Router();

router.get('/hi', function(req,res){
    let arr = [1,2,3,5,6,7]
    let sum =0
    for(let i in arr){
        sum +=arr[i]
    }
    let val = arr.pop()
    let val1 = val * (val+1)/2
    let result = val1 - sum

    res.send( {data: result});
});
module.exports = router;