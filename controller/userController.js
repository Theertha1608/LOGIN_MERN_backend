const mongoose = require("mongoose");
const User = mongoose.model("User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


exports.postSignup =
  ("/signup",
  (req, res, next) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(422).json({ error: " please fill all the fields " });
    }
    User.findOne({ email: email })
      .then((savedUser) => {
        if (savedUser) {
          return res
            .status(422)
            .json({ error: "user already exist with this email" });
        }
        bcrypt
          .hash(password, 12)
          .then((hashedPassword) => {
            const user = new User({
              email,
              password: hashedPassword,
             user_name: name,
            });
            user.save().then((user) => {
              res.json({ message: "singup successfull", user: user });
              console.log(user);
            });
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  });

exports.postSignin =
  ("/signin",
  (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(422).json({ error: "please add email or password" });
    }
    User.findOne({ email: email }).then((savedUser) => {
      if (!savedUser) {
        res.status(422).json({ error: "invalid email or password " });
      }
      bcrypt
        .compare(password, savedUser.password)
        .then((doMatch) => {
          if (doMatch) {
            const token = jwt.sign(
              { _id: savedUser._id },
              process.env.JWT_SECRET
            );
            console.log("token", token, "-->", savedUser._id);
            const { _id, user_name, email } = savedUser;
            res.json({
              message: "succesfully signed in ",
              token,
              user: { _id, user_name, email },
            });
          } else {
            return res.status(422).json({ error: "invalid email or password" });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    });
  });

exports.getAlluser = async (req, res) => {
  try {
    const users = await User.find();
    return res.status(200).json({ message: "all users", users: users });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
exports.getSingleUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findOne({ _id: userId });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({ message: "User found", user: user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};