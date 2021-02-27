const jwt = require("jsonwebtoken");

module.exports =  (req,res,next) => {
  //verify jwt(token,key): it throws error if not  verified thus the try-catch block
  try{
    const token = req.headers.authorization.split(" ")[1]; //headers come as Key: Authorization value:BEARER {TOKEN}
    const decoded = jwt.verify(token,process.env.JWT_KEY);
    req.userData = decoded;
    next();
  }
  catch(error)
  {
      return res.status(401).json({
        message:"Auth Failed"
      });
  }
};
