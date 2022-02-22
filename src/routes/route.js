const express = require('express');
const router = express.Router()

router.get('/movies', function(req,res){
    let movies = ['p.k','3-Idiots','Zero','Dhoom','Rustom','Antim']
    res.send(movies)
})

router.get('/movies/:indexNumber', function(req,res){
    let movies = ['p.k','3-Idiots','Zero','Dhoom','Rustom','Antim']
        for(let i in movies){
            console.log(movies[i]);
        }

})

module.exports = router;