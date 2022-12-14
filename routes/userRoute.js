const express = require("express");
const router = express.Router();
const con = require("../lib/db_connections");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
// const middleware = require("../middleware/auth");
// GET ALL USERS
router.get("/", (req, res) => {
  try {
    con.query("SELECT * FROM users", (err, result) => {
      if (err) throw err;
      res.json(result);
    });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});
// GET ONE USER
router.get("/:user_id", (req, res) => {
  try {
    con.query(
      `SELECT * FROM users where user_id =${req.params.user_id}`,
      (err, result) => {
        if (err) throw err;
        res.send(result);
      }
    );
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});
// REGISTER
router.post("/register", (req, res) => {
  try {
    let sql = "INSERT INTO users SET ?";
    const {
      email,
      password,
      full_name,
      billing_address,
      default_shipping_address,
      country,
      phone,
    } = req.body;
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    let user = {
      email,
      password: hash,
      full_name,
      billing_address,
      default_shipping_address,
      country,
      phone,
    };
    con.query(sql, user, (err, result) => {
      if (err) throw err;
      console.log(result);
      res.json({
        msg: `User ${(user.full_name, user.email)} created successfully`,
      });
    });
  } catch (error) {
    console.log(error);
  }
});
// PUT
router.put("/:user_id", (req, res) => {
  let sql = "UPDATE users SET ?";
  const {
    password,
    full_name,
    billing_address,
    default_shipping_address,
    country,
    phone,
    user_type,
  } = req.body;
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);

  let user = {
    password: hash,
    full_name,
    billing_address,
    default_shipping_address,
    country,
    phone,
    user_type,
  };
  try {
    con.query(sql, user, (err, result) => {
      if (err) throw err;
      res.send(result);
    });
  } catch (error) {
    console.log(error);
  }
});
// DELETE
router.delete("/:user_id", (req, res) => {
  try {
    con.query(
      `DELETE from users WHERE user_id="${req.params.user_id}"`,
      (err, result) => {
        if (err) throw err;
        res.send(result);
      }
    );
  } catch (error) {
    console.log(error);
  }
});

// Login
router.post("/login", (req, res) => {
  try {
    let sql = "SELECT * FROM users WHERE ?";
    let user = {
      email: req.body.email,
    };
    con.query(sql, user, async (err, result) => {
      if (err) throw err;
      if (result.length === 0) {
        res.status(400).json({
          status: "error",
          error: "Email not found please register",
        });
      } else {
        const isMatch = await bcrypt.compare(
          req.body.password,
          result[0].password
        );

        if (!isMatch) {
          res.status(400).json({
            status: "error",
            error: "password incorrect",
          });
        } else {
          // The information the should be stored inside token
          const payload = {
            // user: {
            user_id: result[0].user_id,
            email: result[0].email,
            full_name: result[0].full_name,
            billing_address: result[0].billing_address,
            default_shipping_address: result[0].default_shipping_address,
            country: result[0].country,
            phone: result[0].phone,
            user_type: result[0].user_type,
          };
          // Creating a token and setting expiry date
          jwt.sign(
            payload,
            process.env.jwtSecret,
            {
              expiresIn: "365d",
            },
            (err, token) => {
              if (err) throw err;
              res.json({ token, payload, error: "Login Successful" });
            }
          );
        }
      }
    });
  } catch (error) {
    console.log(error);
  }
});
// Verify
router.get("/users/verify", (req, res) => {
  const token = req.header("x-auth-token");
  jwt.verify(token, process.env.jwtSecret, (error, decodedToken) => {
    if (error) {
      res.status(401).json({
        msg: "Unauthorized Access!",
      });
    } else {
      res.status(200);
      res.send(decodedToken);
    }
  });
});
module.exports = router;
