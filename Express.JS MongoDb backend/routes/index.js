var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Shane Wang CS169 warmup' });
});

module.exports = router;
