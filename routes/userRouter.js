const express = require("express");

const userController = require("../controller/userController");
const authMiddileware = require("../middilware/authMiddileware");

const router = express.Router();

router.post("/signup", userController.postSignup);

router.post("/signin", userController.postSignin);

router.get("/get-all-user", authMiddileware, userController.getAlluser);

router.get(
  "/get-single-user/:userId",
  authMiddileware,
  userController.getSingleUser
);

module.exports = router;