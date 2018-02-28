const User = require('../models/user');
const jwt = require('jwt-simple');
const config = require('../config');

function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
}

exports.signin = function(req, res, next) {
  res.send({token: tokenForUser(req.user)});
}


exports.signup = function(req, res, next) {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res.status(422).send({error: 'you must provide an email and password'});
  }
  User.findOne({ email: email}, function(err, existingUser) {
    if (err) {
      return next(err);
    }

    if (existingUser) {
      return res.status(422).send({error: 'Email is in use'})
    }
  //
    const user = new User({
      email: email,
      password: password
    });

    user.save(function(err) {
      if (err) {
        return next(err);
      }
      res.json({
        token: tokenForUser(user)
      });
    })
  })
  // if a user with an email exists

  // if a user with the email does exist, return an error

  // if a user with email does not exist, create and save record

  //respond to request indicating the user was created
}
