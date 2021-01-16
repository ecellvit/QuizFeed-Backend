# QuizFeed-Backend
Backend of Authentication and Management of Quizfeed
Hoisted at https://quizfeedapi.herokuapp.com/

# DOCUMENTATION

# USER SIGNUP
1. Access Route Using POST Method https://quizfeedapi.herokuapp.com/user/signup 
2. Expecting Name, Email, Password, Access as name(string), email(string), password(string), access(string)
   #### NOTE: Access can be of three types only- student / teacher / admin
4. If Successfully Registered, returns JSON containing Message, Name,Email,Access, and Request Possible

# USER LOGIN
1. Access Route Using POST Method https://quizfeedapi.herokuapp.com/user/login
2. Expecting Email, Password as email(string), password(string)
3. If Successfully Logged In, returns JSON containing message, access, and Token

# CREATING A QUIZ
1. Access Route Using POST Method https://quizfeedapi.herokuapp.com/quiz/createquiz
2. Expecting Quizname, Questions as quizname(string), questions(array of question (string))
3. If Successfully quiz created, returns JSON containing message, quiz id, and url to access quiz data

# GETTING QUIZ DATA
1. Access Route Using GET Method https://quizfeedapi.herokuapp.com/quiz/:quizid (replace quizid with the Quiz Id got while creating Quiz)
2. Expecting QuizId as shown in step 1
3. If Quiz Exists, returns JSON containing quizname and array questions, containing all the questions of the quiz
