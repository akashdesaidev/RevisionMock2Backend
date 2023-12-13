var jwt = require("jsonwebtoken");

const Authentication=(req,res,next) =>{
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "Unauthorized: Missing Authorization header" });
  }

  const token = authHeader.split(" ")[1];
    jwt.verify(token, "shhhhh", function (err, decoded) {
        if (err) {
          return res.send("something went wrong");
        }
         
            next();
        
        }
      );
         
} 
module.exports ={Authentication}