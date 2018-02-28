const passport = require('passport');
const User = require('../models/user');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');


//create a local Strategy
const localOptions = { usernameField: 'email' };

const localLogin = new LocalStrategy(localOptions, function(email, password, done) {
  User.findOne({email: email}, function(err, user) {
    if (err) {return done(err)}
    if (!user) {return done(null, false)}

    // compare passwords. is password equal to user.password?
    user.comparePassword(password, function(err, isMatch) {
      if (err) { return done(err) }
      if (!isMatch) { return done(null, false) }
      console.log(user);
      return done(null, user)
    });
  });


  // verify username and password,
  // if it is, correct, call done with username and password,
  // otherwise call done with false
})

//set up options for jwt JwtStrategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.secret
};

// create jwt Strategy
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
  // See if the user iD in the payload exists in our database, if so, call done with user, otherwise call done without a user object
  User.findById(payload.sub, function(err, user) {
    if (err) {return done(err, false)};

    if (user) {
      done(null, user);
    } else {
      done(null, false);
    }
  })
});

// tell passport to use this strategy
passport.use(jwtLogin);
passport.use(localLogin);
