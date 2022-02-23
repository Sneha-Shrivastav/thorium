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


let arr = [ {

    "name": "manish",
  
    "dob": "1/1/1995",
  
    "gender": "male",
  
    "city": "jalandhar",
  
    "sports": [
  
      "swimming"
  
    ],
  
    "bookings": [
  
      
  
  {
  
   "bookingNumber": 1,
  
    "sportId": "",
  
    "centerId": "",
  
   "type": "private",
  
   "slot": '16286598000000',
  
   "bookedOn": '31/08/2021',
  
   "bookedFor": '01/09/2021'
  
  },
  
   
  
  {
  
   "bookingNumber": 2,
  
    "sportId": " ",
  
    "centerId": " ",
  
   "type": "private",
  
   "slot": '16286518000000',
  
   "bookedOn": '31/08/2001',
  
   "bookedFor": 01/09/2001
  
  },
  
  
  
  
    ]
  
  },
  
  
  {
  
    "name": "gopal",
  
    "dob": "1/09/1995",
  
    "gender": "male",
  
    "city": "delhi",
  
    "sports": [
  
      "soccer"
  
    ],
  
    "bookings": [
  
      
  
    ]
  
  },
  
  {
  
    "name": "lokesh",
  
    "dob": "1/1/1990",
  
    "gender": "male",
  
    "city": "mumbai",
  
    "sports": [
  
      "soccer"
  
    ],
  
    "bookings": [
  
      
  
    ]
  
  },
  
  
  
  ]

  router.post('/players', function(req,res){
    let ele = req.body.element
    arr.push(ele)
    res.send(arr)
  })


module.exports = router;