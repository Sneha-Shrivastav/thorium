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

router.get('/films', function(req,res){
    res.send( [ {
 id: 1,
 name: "The Shining"
}, {
 id: 2,
 name: "Incendies"
}, {
 id: 3,
 name: "Rang de Basanti"
}, {
 id: 4,
 name: "Finding Demo"
}])

})

router.get('/films/:filmId', function(req,res){
    let films = [ {
        id: 1,
        name: "The Shining"
       }, {
        id: 2,
        name: "Incendies"
       }, {
        id: 3,
        name: "Rang de Basanti"
       }, {
        id: 4,
        name: "Finding Demo"
       }]
    let values = req.params.filmId;
    if(values>films.length-1){
        res.send(" No movie exists with this id")
    }else{
        res.send(films[values])
    }

})

module.exports = router;