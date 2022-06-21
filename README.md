# taxManagement


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

 
# details of apis

1) user sign up 
2) userTaxCreation,3)
4)getTaxDetailsById,
5)getTaxDetailsFiltres,
6) markTaxPaid ,
7) createTaxDue



STAR 


# apis are protected via authentication and authorization 
 json web token 
 why? 
 reduced the load of server for the authentication and authorization 
 



# validations and classifications of project 

created index.js file 
route 
validator 
controllers 
middleware 
models  seperately  for the efficiency 

