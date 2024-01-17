const Jwt = require("jsonwebtoken");
const User = require("../model/userModel");
const mongoose = require("mongoose");

const authMiddileware = (req, res, next) => {
  const authorizationHeader = req.headers.authorization;
  console.log("authorizationHeader", authorizationHeader);

  if (!authorizationHeader) {
    return res.status(401).json({ message: "Unauthorized access" });
  }

  const token = authorizationHeader.replace("Bearer ", "");

  Jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    console.log("payload", payload);
    if (err) {
      return res.status(401).json({ message: "You must be logged in" });
    }

    const { _id } = payload;
    User.findById(_id)
      .then((userData) => {
        req.user = userData;
        next();
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        return res
          .status(500)
          .json({ message: "Internal server error, try again" });
      });
  });
};

module.exports = authMiddileware;