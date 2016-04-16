var express = require('express');
var bodyParser = require('body-parser');
var checkLogin = require('./public/js/main');

var port = 3000;
var app = express();
var router = express.Router();
app.use('/public', express.static('./public'));
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

app.set('view engine', 'jade');
app.set('views', './views')

function showLoginError(username, res) {
  res.render('index', { title: 'Login', message: "Invalid Username or Password!"});
}

function showLoginSuccess(username, res) {
  res.render('users', { title: 'Edit Profile', name: username });
}

function showPasswordError(username, res) {
  res.render('update', { title: 'Update Password', name: username, message: 'Please Enter Valid Password!' });
}

function showPasswordSuccess(username, res) {
  res.render('password', { title:'Update Password', name: username, message: 'Password successfully changed!' });
}

router.get('/login', function (req, res) {
  res.render('index', {title: 'Login'});
});

router.post('/login-result', function (req, res) {
  var uname = req.body.uname;
  var password = req.body.password;
  checkLogin.userID(uname, password, checkLogin.userLogin, checkLogin.getID, checkLogin.login, showLoginError, showLoginSuccess, res);
});

router.post('/account', function (req, res) {
  var uname = req.body.uname;
  res.render('update', {title: 'Update Password', name: uname });
});

router.post('/account-result', function (req, res) {
  var uname = req.body.uname;
  var password = req.body.password;
  checkLogin.updatePassword(uname, password, checkLogin.update, showPasswordError, showPasswordSuccess, res);
});

app.use('/Real_Estate', router);

app.listen(port, function () {
  console.log('Real Estate App is running on http://localhost:' + port + '/Real_Estate');
});
