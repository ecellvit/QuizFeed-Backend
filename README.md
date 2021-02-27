#To DO
- [X]   Verification of Teacher posting Quiz
- [ ]   Showing all quizzes created by teacher   
- [ ]   ------------THE END OF TEACHERS PART 1------
- [ ]   Show Students all available quizes post verification is student
- [ ]   Show all questions of quiz '' ''
- [ ]   store answer for all question of quiz '' ''
- [ ]   -----------THE END OF STUDENTS PART 1-----
- [ ]   Showing all quizzes created by teacher
- [ ]   Showing all students who attempted quiz query through quiz id/name
- [ ]   Showing all answers by student selected
- [ ]   Store marks for each answer of the student in the quiz
- [ ]   ----------THE END OF TEACHER PART 2-------
- [ ]   Show Students all marks he got in quiz according to quiz
- [ ]   ----------THE END OF STUDENT PART 2-------

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
