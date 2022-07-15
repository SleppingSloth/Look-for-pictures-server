import jvt from "jsonwebtoken";
import key from "../config/config.js";

export default function (req, res, next){
    if(req.method === "OPTIONS"){
        next();
    }

    try {
        const token = req.headers.authorization.split(" ")[1];
        if(!token){
            return res.status(403).json({message: "User is not authorized"})
        }
        const decadedData = jvt.verify(token, key.secret);
        req.user = decadedData;
        next();
    } catch (error) {
        console.log(error);
        return res.status(403).json({message: "User is not authorized"})
    }
}