# Tax project


Goal is to manage taxRelated Task 
by managing signup and CRUD operations 

//approach 


step 0 
i have created two models user Model and taxModel and 
and ever tax document is linked with  specific user (ref )  

step 1 is to create sign up options for three kind of  users 
taxPayer , taxAccountant  , admin 

 in this project i have done this via Schema in mongoDB via mongoose  by an option of selecting role 
 user can select the role  ['taxPayer','taxAcc','admin ']



 for the simplicity this project  it have scenario of only salesTax.
 and have capability of intigration with incomeTax also 

 
# details of apis

1) user sign up 
2) userTaxCreation,3)
4)getTaxDetailsById,
5)getTaxDetailsFiltres,
6) markTaxPaid ,
7) createAndEditTaxDue



STAR (situation Task ACtion REsult )


# apis are protected via authentication and authorization 
 json web token 
 why? 
 reduced the load of server for the authentication and authorization 


 when users Login they will rewarded token [in header ] which sent back to their browser with details like userId and role 

 when users comes next time . they need  not to login, instead browser send the token to server in header .

 server will decoded it and perform neccessary operations for authentiction and authorization .

  most common one is checking the decoded token userId with userid of params or from request 


 



# validations and classifications of project 

created index.js file 
route 
validator 
controllers 
middleware 
models  seperately  for the efficiency 


please go through the code more information is available there via comments section 



# how i undo changes 
i followed soft delete methods i.e every schema is have a key of isDeleted  which has default boolean value false 

when user wanna delete its account he/she just turn isDeletedkey to true .
data wont be deleted but flagged and remain in database 
admin can change the status again 



