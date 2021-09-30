const express = require('express'),
router = express.Router();

// get user lists
router.get('/list', function(req, res) {
  let sql = `SELECT * FROM users`;
  db.query(sql, function(err, data, fields) {
    if (err) throw err;
    res.json({
      status: 200,
      data,
      message: "User lists retrieved successfully"
    })
  })
});

// create new user
router.post('/new', function(req, res) {
  let sql = `INSERT INTO users(firstName, lastName,role,email,password,accountHolderID,accountID) VALUES (?)`;
  let values = [
    req.body.firstName,
    req.body.lastName,
    req.body.role,
    req.body.email,
    req.body.password,
    req.body.accountHolderID,
    req.body.accountID
  ];
  db.query(sql, [values], function(err, data, fields) {
    if (err) throw err;
    res.json({
      status: 200,
      message: "New user added successfully"
    })
  })
});

module.exports = router;