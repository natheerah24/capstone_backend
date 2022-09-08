const express = require("express");
const router = express.Router();
const con = require("../lib/db_connections");
// GET ALL PROUCTS
router.get("/", (req, res) => {
  try {
    con.query("SELECT * FROM products", (err, result) => {
      if (err) throw err;
      res.send(result);
    });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});
// GET ONE PRODUCT
router.get("/:id", (req, res) => {
  try {
    con.query(
      `SELECT * FROM products where product_id =${req.params.id}`,
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
// POST
router.post("/", (req, res) => {
  const {
    sku,
    name,
    price,
    weight,
    descriptions,
    image,
    category,
    country,
    stock,
  } = req.body;
  try {
    con.query(
      `INSERT into products (sku,name,price,weight,descriptions,image,category,country,stock) values ('${sku}','${name}','${price}','${weight}','${descriptions}','${image}','${category}','${country}','${stock}')`,
      (err, result) => {
        if (err) throw err;
        res.send(result);
      }
    );
  } catch (error) {
    console.log(error);
  }
});
// PUT
router.put("/:id", (req, res) => {
  const {
    sku,
    name,
    price,
    weight,
    descriptions,
    image,
    category,
    country,
    stock,
  } = req.body;
  try {
    con.query(
      `UPDATE products SET sku='${sku}',name='${name}',price='${price}',weight='${weight}',descriptions='${descriptions}',country='${country}',image='${image}',category='${category}',stock='${stock}'WHERE product_id=${req.params.id}`,
      (err, result) => {
        if (err) throw err;
        res.send(result);
      }
    );
  } catch (error) {
    console.log(error);
  }
});
// DELETE
router.delete("/:id", (req, res) => {
  try {
    con.query(
      `DELETE from products WHERE product_id="${req.params.id}"`,
      (err, result) => {
        if (err) throw err;
        res.send(result);
      }
    );
  } catch (error) {
    console.log(error);
  }
});
module.exports = router;
