# TO DO
- [X]   Verification of Teacher posting Quiz
- [X]   Showing all quizzes created by teacher  
- [X]   Get name of quiz when quiz id passed 
- [X]   ------------THE END OF TEACHERS PART 1------
- [X]   Show Students all available quizes post verification is student
- [X]   Show all questions of quiz '' ''
- [X]   Store answer for all question of quiz '' ''
- [X]   -----------THE END OF STUDENTS PART 1-----
- [X]   Showing all quizzes created by teacher
- [X]   Showing all students who attempted quiz query through quiz id/name
- [X]   Showing all answers by student selected
- [X]   Store Total marks for each quiz of the student in the quiz
- [X]   ----------THE END OF TEACHER PART 2-------
- [X]   Show Students all marks he got in quiz according to quiz
- [X]   ----------THE END OF STUDENT PART 2-------
- [X]   Make sure quiz can be given once only
- [ ]   Make Sure only non-attempted quizes are shown
- [ ]   Security Features
- [ ]   ----------THE END OF FEATURES ADDITIONAL ------

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
2. Header must have Authorization Token with access of teacher
3. Expecting Quizname, Questions as quizname(string), questions(array of question (string)) in JSON format
4. If Successfully quiz created, returns JSON containing message, quiz id, and url to access quiz data

# GETTING ALL QUIZES
1. Access Route Using GET Method https://quizfeedapi.herokuapp.com/quiz/showAllQuizes
2. Header must have Authorization Token with access of student
3. If Successfully returns JSON containing key value pairs of quiz_name as key and quiz_id as value

# GETTING ALL QUIZES CREATED BY TEACHER
1. Access Route Using GET Method https://quizfeedapi.herokuapp.com/quiz/showAllCreatedQuizes
2. Header must have Authorization Token with access of teacher
3. If Successfully returns JSON containing key value pairs of quiz_name as key and quiz_id as value created by teeacher

# GETTING QUIZNAME BY QUIZ ID
1. Access Route Using GET Method https://quizfeedapi.herokuapp.com/quiz/getQuizName/:quizId
2. Expecting QuizId as shown in step 1
3. Header must have Authorization Token
4. If Successfully returns JSON containing quizname

# GETTING QUIZ DATA
1. Access Route Using GET Method https://quizfeedapi.herokuapp.com/quiz/:quizid (replace quizid with the Quiz Id got while creating Quiz)
2. Header must have Authorization Token
3. Expecting QuizId as shown in step 1
4. If Quiz Exists, returns JSON containing quizname, quiz_id and questions JSON containing key value pairs of question_id as key and question as value

# SENDING ANSWER TO QUIZ QUESTIONS
1. Access Route Using POST Method https://quizfeedapi.herokuapp.com/answer 
2. Header must have Authorization Token with access student
3. Expecting quiz_id, question_ids of the quiz, answers as quiz_id(int), question_ids(array of question_id(int)), answers(array of answer(string)) in JSON format
4. NOTE: The question_ids array and the answers array must be in order
5. If Successfully answer enter, returns JSON containing message

# GETTING ALL STUDENTS WHO ATTEMPTED A QUIZ BY QUIZ ID
1. Access Route Using POST Method https://quizfeedapi.herokuapp.com/quiz/showAllAttempted 
2. Header must have Authorization Token with access teacher
3. Expecting quiz_id as quiz_id(int) in  JSON format
4. If Successfull returns persons_attempt Json containing Person ID as Key and Person Name as Value

# ENTERING MARKS FOR A STUDENT FOR A QUIZ
1. Access Route Using POST Method https://quizfeedapi.herokuapp.com/marks/enter 
2. Header must have Authorization Token with access teacher
3. Expecting quiz_id,p_id of student, mark as quiz_id(int), p_id(int), mark(int) in  JSON format

# GETTING ALL MARKS OF STUDENT 
1. Access Route Using POST Method https://quizfeedapi.herokuapp.com/marks/getStudentMarks 
2. Header must have Authorization Token with access student
3. If Successfull returns all_marks Json containing quiz_id as Key and mark as Value of that student

# GETTING  MARKS OF STUDENT BY ID
1. Access Route Using POST Method https://quizfeedapi.herokuapp.com/marks/getStudentMarksByPID 
2. Header must have Authorization Token with access teacher
3. Expecting p_id as p_id(int) in  JSON format
4. If Successfull returns all_marks Json containing quiz_id as Key and mark as Value
