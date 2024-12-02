const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const User = require("../modules/User");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser");

require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

//Route 1 : Create a user using : POST "api/auth/createuser". No login required
router.post(
  "/createuser",
  [
    body("name", "Enter a valid name").isLength({ min: 3 }), //adding validation details
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password must be atleast 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    const result = validationResult(req);
    let success = false;
    if (result.isEmpty()) {
      //result is empty means there's no error
      try {
        let user = await User.findOne({ email: req.body.email }); //to find if email already exist
        if (user) {
          return res
            .status(400)
            .json({ success, error: "Sorry! User with this email already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt);

        user = await User.create({
          //creating user
          name: req.body.name,
          email: req.body.email,
          password: secPass,
        });

        //Jsonwebtoken is used to give token to user for authentication, by using a data (here userid) and sign.
        
        const data = {
          user:{
            id: user.id,
          }
        };

        const authtoken = jwt.sign(data, JWT_SECRET);

        success = true;
        res.json({ success, authtoken }); //returning token

        // res.json(user);   // returning json
      } catch (error) {
        console.log(error.message);
        res.status(500).send("Ooops! there was an error");
      }

      // .then(user => res.json(user))
      // .catch(err=> {console.log(err)
      //     res.json({error: "please enter a unique email",message: err.message})
      // })
    } else {
      //if result is not empty
      res.status(400).send({ success, errors: result.array() });
    }
  }
);

//Route 2 : Authenticate a user using : POST "api/auth/createuser". No login required

router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(), //adding validation details
    body("password", "Password cannot be blank").exists(),
  ],
  async (req, res) => {
    const result = validationResult(req);
    let success = false;
    if (result.isEmpty()) {
      const { email, password } = req.body;
      try {
        // taking request credentials
        let user = await User.findOne({ email });

        if (!user) {
          return res
            .status(400)
            .json({ success,error: "Please enter correct credentials" });
        }

        const passCompare = await bcrypt.compare(password, user.password);

        if (!passCompare) {
          return res
            .status(400)
            .json({ success, error: "Please enter correct credentials" });
        }
        
        const data = {
          user: {
            id: user.id,
          }
        }; 

        const authtoken = jwt.sign(data, JWT_SECRET);

        success = true;
        res.json({success, authtoken });

      } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal server error");
      }
    } else {
      //if result is not empty
      res.status(400).send({ errors: result.array() });
    }
  }
);

// Route 3 : Get loogedin user details using : POST "api/auth/getuser". Login required

router.post("/getuser", fetchuser, async (req, res) => {
  try {
    userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user)
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal server error");
  }
});

module.exports = router;
