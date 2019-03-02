// passport.js

const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');
const config = require('./config')
const User = mongoose.model('users');
const opts = {};

opts.jwtFromRequest = ExtractJWT.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.JWT;
opts.issuer = 'naveenrobotics@live.in';

module.exports = passport => {
    passport.use(new JWTStrategy(opts, (jwt_payload, done) => {
        User.findById(jwt_payload.id, function (err, user) {
            if (err) {
                return done(err, {
                    status: false,
                    message: err
                });
            }
            if (user) {
                return done(null, user);
            } else {
                return done(null, {
                    status: false,
                    message: "Unauthorized"
                });
            }
        })
        // .then(user => {
        //     if (user) {
        //         return done(null, user);
        //     }
        //     return done(null, {
        //         status: false,
        //         message: "Unauthorized"
        //     });
        // })
        // .catch(err => console.error(err));
    }));
    
}