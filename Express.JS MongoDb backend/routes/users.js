var express = require('express');
var router = express.Router();

/* GET /users. */
router.get('/', function(req, res) {
  var db = req.db;
  db.collection('users').find().toArray(function (err,items){
  	res.json(items);
  	console.log(items);
  });
});


/* POST /users/add */
router.post('/add', function(req,res) {
	var db = req.db;
	var code = validate(req.body.user, req.body.password);
	if (code != 1) {
		if (code === -3) {
			var msg = "The user name should be non-empty and at most 128 characters long. Please try again.";
		}
		else if (code === -4) {
			var msg = "The password should be at most 128 characters long. Please try again.";
		}
		res.send({errCode: code});
		return code;
		//callback(code);
		//return;
	}
	else {
		db.collection('users').find({user: req.body.user}).toArray(function (err,items){
			if (typeof items[0] === 'undefined') {
				db.collection('users').insert({user: req.body.user, password: req.body.password, count: 1}, function(err, result){
				res.send({errCode : 1, count : 1});
				return 1;
				});
			}
			else  {
				res.send({errCode: -2});
				return -2;
			}
		});
	}
});

/* POST /users/login */
router.post('/login', function(req,res) {
	var db = req.db;
	//verify if legal input
	var code = validate(req.body.user, req.body.password);
	if (code != 1) {
		code = -1;
		res.send({errCode : code});
	}
	//verify if user exists
	db.collection('users').find({user: req.body.user, password: req.body.password}).toArray(function (err,items) {
		if (typeof items[0] === 'undefined') {
			console.log(items);
			console.log("Cannot find the user/password pair in the database");
			res.send({errCode :-1});
			return -1;
		}
		else {
			var newCount = items[0]["count"] + 1;
			console.log("newCount is equal to" + newCount);
			db.collection('users').update({user:items[0]["user"],password:items[0]["password"],count:items[0]["count"]},{user:items[0]["user"],password:items[0]["password"],count:items[0]["count"]+1}, function(err, result){
				//nothing mothofucka
			});
			//db.dropDatabase(); 
			res.send({errCode : 1, count : newCount});
			return 1;
		}
	}
	);
}); 





var validate = function (user, password) {

	if (user.length === 0 || user.length > 128) {
		return -3; //ERR_BAD_USERNAME
	}

	if (password.length > 128) {
		return -4; //ERR_BAD_PASSWORD
	}


	return 1; //SUCCESS
}




module.exports = router;