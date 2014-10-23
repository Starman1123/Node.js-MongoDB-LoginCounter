var express = require('express');
var router = express.Router();

/* POST TESTAPI/resetFixture */
router.post('/resetFixture', function(req,res) {
	var db = req.db;
	db.collection('users').drop();
	res.send({errCode : 1});
	return 1;

});

module.exports = router;
