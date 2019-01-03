var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
  res.json({
    status: true,
    message: "API is working"
  })
});

module.exports = router;