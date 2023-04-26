const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");
const passport = require("passport");

// Load input validation
const validateRegisterInput = require("../validation/register");
const validateLoginInput = require("../validation/login");

// Load User model
const User = require("../models/user");
router.get('/test', function(req, res) {
  res.json('ok');
});

// @route POST api/users/register
// @desc Register user
// @access Public
router.post("/register", (req, res) => {
  console.log(req.body);
  // Form validation

  const { errors, isValid } = validateRegisterInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ username: req.body.username }).then(user => {
    if (user) {
      return res.status(400).json({ username: "Username already exists" });
    } else {
      const newUser = new User({
        username: req.body.username,
        name: req.body.name,
        password: req.body.password,
        role: req.body.role,
      });

      // Hash password before saving in database
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public
router.post("/login", (req, res) => {
  // Form validation

  const { errors, isValid } = validateLoginInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const username = req.body.username;
  const password = req.body.password;

  // Find user by username
  User.findOne({ username }).then(user => {
    // Check if user exists
    if (!user) {
      return res.status(404).json({ usernamenotfound: "Username not found" });
    }

    // Check password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // User matched
        // Create JWT Payload
        const payload = {
          id: user.id,
          // username: user.username,
          role: user.role
        };

        // Sign token
        jwt.sign(
          payload,
          keys.secretOrKey,
          {
            expiresIn: 31556926 // 1 year in seconds
          },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token
            });
          }
        );
      } else {
        return res
          .status(400)
          .json({ passwordincorrect: "Password incorrect" });
      }
    });
  });
});

// router.get(
//   "/admins", function(req, res){
//     User.find({userType: true}).exec(function(err, foundAdmins){
//       if(err){
//         res.json(undefined);
//       }else{
//         res.json(foundAdmins);
//       }
//     })
//   });

//   router.get(
//     "/", function(req, res){
//       User.find().exec(function(err, foundUsers){
//         if(err){
//           console.log(err);
//           res.json(err);
//         }else{
//           res.json(foundUsers);
//         }
//       })
//     });

//   router.patch("/admin/:id", function(req, res){
//     User.findById(req.params.id).exec(function(err, foundUsers){
//       if(err){
//         // res.json(undefined);
//         console.log(err); 
//       }else{
//         // res.json(foundUsers);
//         console.log(foundUsers.userType);
//         if(foundUsers.userType === true){
//           var admin = {
//             userType: false,
//           }
//         }else{
//           var admin = {
//             userType: true,
//           }
//         }
//         User.findByIdAndUpdate(req.params.id, admin, {new: true}, function (err, updatedUser){
//           if(err){
//             console.log(err)
//             res.json(err);
//           }else{
//             res.json(updatedUser);
//           }
//       });
//       }
//     });
// });  

// router.patch("/admin/:id/remove", function(req, res){
//     var admin = {
//       userType: false,
//     }
//       User.findByIdAndUpdate(req.params.id, admin, {new: true}, function (err, updatedUser){
//         if(err){
//           res.json(err);
//         }else{
//           res.json(updatedUser);
//         }
//     });
// });  
  
module.exports = router;
