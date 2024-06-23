const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const Fetchuser = require('../middleware/Fetchuser');
const jwt_token = "shhhh";


router.post(
  '/createuser',
  [
    body('name').isLength({ min: 3 }).withMessage('Name must be at least 3 characters long'),
    body('email').isEmail().withMessage('Enter a valid email address'),
    body('password').isLength({ min: 5 }).withMessage('Password must be at least 5 characters long')
  ],
  async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }

    try {
      const { name, email, password } = req.body;
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ success, error: "User with this email already exists" });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      user = new User({ name, email, password: hashedPassword });
      await user.save();

      const data = { user: { id: user.id } };
      const token = jwt.sign(data, jwt_token);

      success = true;
      res.json({ success, token });
    } catch (err) {
      console.error(err.message);
      res.status(500).send({ success, message: err.message });
    }
  }
);



//Route : 2 , Login functionality
router.post(
  '/login',
  [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password cannot be blank').exists(),
  ],
  async (req, res) => {
    // Validation of email and password
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      let success = false;
      if (!user) {
        return res.status(400).json({ error: "Please enter correct credentials" });
      }

      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      if (!isPasswordCorrect) {
        return res.status(400).json({ success, error: "Please enter correct credentials" });
      }

      const payload = {
        user: {
          id: user.id,
        },
      };

      const token = jwt.sign(payload, jwt_token);
      success = true;

      res.json({ success , token });
    } catch (err) {
      console.error(err.message);
      res.status(500).send({ message: err.message });
    }
  }
);

//Route : 3 , Get loggedIn user details

router.post(
  '/getdetails', Fetchuser, async (req, res) => {

    try {
      userId = req.user.id;
      const user = await User.findById(userId).select("-password");
      res.send(user);
    } catch (err) {
      console.error(err.message);
      res.status(500).send({ message: err.message });
    }
  }
)
module.exports = router;
