const express = require('express');
const { route } = require('express/lib/application');
const router = express.Router();

// router.get('/hi', function(req,res){
//     let arr = [1,2,3,5,6,7]
//     let sum =0
//     for(let i in arr){
//         sum +=arr[i]
//     }
//     let val = arr.pop()
//     let val1 = val * (val+1)/2
//     let result = val1 - sum

//     res.send("missing value is " + result);
// });

// router.get('/hello', function(req,res){
//     let arr = [33,34,35,37,38]
//     let len = arr.length
//     let sum = 0
//     for(let i in arr){
//         sum += arr[i]
//     }
//     let firstElement = arr[0]
//     let val = arr.pop()
//     let val2 = (len + 1) * (firstElement+val)/2
//     let result = val2 - sum

//     res.send("missing value is "+ result);
// });


let players = []

  router.post('/players', function(req,res){
    let player = req.body
    let playerName = player.name
    for(let i=0; i<players.length; i++){
      if(players[i].name == player){
        res.send("player already exist")
    }
}
players.push(player);
res.send(players)
});

  router.post('/players/:playerName/bookings/:bookingId', function(req,res){
    let name = req.params.playerName
    let isPlayerPresent = false

    for(let i=0; i<players.length; i++){
      if(players[i].name == name){
        isPlayerPresent = true
      }
    }
    if(!isPlayerPresent){
      return res.send("Player not present")
    }
    let booking = req.body
    let bookingId = req.params.bookingId
    for(let i=0; i<isPlayerPresent.length; i++){
      if(players[i].name == name){
        let isBookingPresent = false
        for(let j=0; j<player[i].bookings.length; j++){
          if(players[i].booking[j].bookingNumber == bookingId){
            return res.send('Booking with this id is already present for the player')
          }
        }
        players[i].bookingId.push(booking)
      }
    }
    res.send(players)
  })


module.exports = router;