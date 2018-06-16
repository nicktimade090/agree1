const express = require('express')
const app = express()
var mysql = require('mysql');
var bodyParser = require('body-parser');


app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

var con = mysql.createConnection({
  host     : 'localhost',//'temp.ckiocwfmeq58.us-west-2.rds.amazonaws.com',
  user     : 'root',//'vips',
  password : '123456789',//'12345678',
  database : 'db'
 
});
con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

app.post('/reguser', function (req, res) {

	var fname = req.body.firstName
	var lname = req.body.lastName
	var email = req.body.email
	var pass = req.body.password
	
	
	var sql = "select * from users where email='"+email+"';"
	con.query(sql, function (err, result) {
		if (err) throw err;
			if(!(JSON.stringify(result) == '[]')) {
				return res.send("email already reg");
			} else {
				
				var ses = getDateTime()+''+Math.floor(Math.random() * Math.floor(5000));
	
				sql = "INSERT INTO `users` (`id`, `fname`, `lname`, `email`, `password`, `session`) VALUES (NULL, '"+fname+"', '"+lname+"', '"+email+"', '"+pass+"', '"+ses+"');"
				
				con.query(sql, function (err, result) {
					if (err) throw err;
						console.log("1 record inserted, ID: " + result.insertId);
						return res.send("user Created")
				});
			}		
	});
})

app.post('/login', function (req, res) {

	var email = req.body.email
	var pass = req.body.password
	
	var ses = getDateTime()+''+Math.floor(Math.random() * Math.floor(5000));
	
	var sql = "select * from users where email='"+email+"' and password = '"+pass+"';"
	
	con.query(sql, function (err, result) {
		if (err) throw err;
			console.log(result);
			if(JSON.stringify(result) == '[]')
				res.send("wrong pass")
			else {
				sql = "UPDATE `users` SET `session` = '"+ses+"' WHERE `users`.`email` = '"+email+"'";
				con.query(sql, function (err, result) {
				if (err) throw err;
					console.log("session updated: " + result.insertId);
					res.send(ses)
				});	
			}
	});
	
})

app.get('/check', function (req, res) {

	var ses = req.param('session')
	
	

})

app.post('/get', function (req, res) {
	
	sql = "select * from sensors order by timestamp desc limit 1;"
	con.query(sql, function (err, result) {
		if (err) throw err;
			var o = result[0];
			console.log("get reques")
			res.send(JSON.stringify(o))
	});  	
})

function getDateTime() {

    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    return year + "" + month + "" + day + "" + hour + "" + min + "" + sec;

}
app.listen(3000, () => console.log('Example app listening on port 3000!'))