# QuizFeed-Backend
Backend of Authentication and Management of Quizfeed
Hoisted at https://quizfeedapi.herokuapp.com/

# DOCUMENTATION

# USER SIGNUP
1. Access Route Using POST Method https://quizfeedapi.herokuapp.com/user/signup 
2. Expecting Name, Email, Password, Access as name, email, password, access
   # NOTE: Access can be of three types only- student / teacher / admin
4. If Successfully Registered, returns JSON containing Message, Name,Email,Access, and Request Possible

# USER LOGIN
1. Access Route Using POST Method https://quizfeedapi.herokuapp.com/user/login
2. Expecting Email, Password as email, password
3. If Successfully Logged In, returns JSON containing message and Token
