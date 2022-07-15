import jwt from "jsonwebtoken";
import key from "../config/config.js";

export default function (roles) {
  return function (req, res, next) {
    if (req.method === "OPTIONS") {
      next();
    }

    try {
      const token = req.headers.authorization.split(" ")[1];
      if (!token) {
        return res.status(403).json({ message: "User is not authorized" });
      }

      const { roles: userRoles } = jwt.verify(token, key.secret);
      let hasRole = false;

      userRoles.forEach((role) => {
        if (roles.indexOf(role) !== -1) {
          hasRole = true;
        }
      });

      if (!hasRole) {
        return res.status(403).json({ message: "You do not have access" });
      }

      next();
    } catch (error) {
      console.log(error);
      return res.status(403).json({ message: "User is not authorized" });
    }
  };
}
