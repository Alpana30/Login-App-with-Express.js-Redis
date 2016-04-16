var crypto = require('crypto');
var redis = require('redis');
var client = redis.createClient();

exports.userID = function (username, password, userLogin, getID, login, showError, showSuccess, res) {
  client.hget("users", username,function (err, uID) {
      if (err) {
        console.log(err);
      }
      else {
        getID(uID, username, password, userLogin, login, showError, showSuccess, res);
      }
    });
}

exports.userLogin = function (id,  username, password, login, showError, showSuccess, res) {
  var hashPwd = crypto.createHash('sha256').update(password).digest('base64');
  client.hmget("users:" + id, "email", "password", function (err, loginArray) {
    if (err) {
      console.log(err);
    } else {
      login(username, hashPwd, loginArray, showError, showSuccess, res);
    }
  });
}

exports.login = function (username, password, loginArray, showError, showSuccess, res) {
  if (password === loginArray[1]) {
     showSuccess(username, res);
  } else {
      showError(username, res);
  }
}

exports.getID = function (id, username, password, userLogin, login, showError, showSuccess, res) {
  if (id === null) {
    showError(username, res);
  } else {
    userLogin(id, username, password, login, showError, showSuccess, res);
  }
}

exports.updatePassword = function (username, password, update, showError, showSuccess, res) {
  if (password) {
    client.hget("users", username,function (err, uID) {
        if (err) {
          console.log(err);
        }
        else {
          update(uID, username, password, showError, showSuccess, res);
        }
      });
  }else {
    showError(username, res);
  }
}

exports.update = function (id, username, password, showError, showSuccess, res) {
  var newHashPwd = crypto.createHash('sha256').update(password).digest('base64');
  client.hset("users:" + id, "password", newHashPwd, function (err) {
      if (err) {
        console.log(err);
      } else {
        showSuccess(username, res);
      }
  });
}
