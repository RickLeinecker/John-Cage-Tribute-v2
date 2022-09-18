const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');
const normalize = require('normalize-url');

// @route    POST api/users
// @desc     Register user
// @access   Public
router.post("/create", (res, req) => {
      const username = req.body.username;
      const email = req.body.email;
      const password = req.body.password;
      db.query("INSERT INTO users (userId, username, email, password, accountType) VALUES (?,?,?,?,?)", [NULL, username, email, password, 0],
      (err, res) => {
        if (err) {
          console.log(err);
        } else {
          res.send("Values Inserted");
        }
      }
  );
});

module.exports = router;
