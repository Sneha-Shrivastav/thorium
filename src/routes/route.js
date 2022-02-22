const express = require('express');
const router = express.Router()

router.get('/movies', function(req,res){
    res.send("['p.k','3-Idiots','Zero','Dhoom','Rustom','Antim']")
})

router.get('/movies/:indexNumber', function(req,res){
    let movies = ['p.k','3-Idiots','Zero','Dhoom','Rustom','Antim']
    let values = req.params.indexNumber;
    if(values>movies.length-1){
        res.send("Doesn't Exist")
    }else{
        res.send(movies[values])
    }

})

module.exports = router;