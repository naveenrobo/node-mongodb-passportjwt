const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../helpers/config')
const User = require('../models/User');
const validation = require('../controllers/user.validator');
const isEmpty = require('../helpers/isEmpty');
const ses = require('../helpers/email');

module.exports = {
    register: function (req, res) {
        console.log(JSON.stringify(req.user));

        const {
            reason,
            hasPermission
        } = validation.validatePermission(req.user, req.body);

        if (!hasPermission) {
            return res.status(401).json({
                status: false,
                message: reason
            });
        }

        const {
            errors,
            isValid
        } = validation.validateRegisterInput(req.body);

        if (!isValid) {
            return res.status(400).json({
                status: false,
                message: errors
            });
        }

        User.findOne({
                email: req.body.email
            })
            .then(user => {
                if (user) {
                    return res.status(400).json({
                        status: false,
                        message: 'Email already registered'
                    });
                } else {
                    var data = req.body;
                    data.registrar = req.user.id;

                    const newUser = new User(data)
                    bcrypt.genSalt(config.SALT, (err, salt) => {
                        if (err) console.error('There was an error', err);
                        else {
                            bcrypt.hash(req.body.password, salt, (err, hash) => {
                                if (err) console.error('There was an error', err);
                                else {
                                    newUser.password = hash
                                    newUser
                                        .save()
                                        .then(() => {
                                            return res.json({
                                                status: true,
                                                message: "User registered successfully"
                                            })
                                        })
                                        .catch(err => {
                                            return res.json({
                                                status: false,
                                                message: err
                                            })
                                        })

                                }
                            });
                        }
                    });
                }
            })
            .catch(err => {
                console.error(err);
                return res.json({
                    status: false,
                    message: err
                })
            })
    },
    login: (req, res) => {
        const {
            errors,
            isValid
        } = validation.validateLoginInput(req.body);

        if (!isValid) {
            return res.status(400).json({
                status: false,
                message: errors
            });
        }
        console.log(JSON.stringify(req.body));
        const email = req.body.email;
        const password = req.body.password;

        User.findOne({
                email
            })
            .then(user => {
                if (!user) {
                    return res.status(404).json({
                        status: false,
                        message: "User not found"
                    });
                }
                bcrypt.compare(password, user.password)
                    .then(isMatch => {
                        if (isMatch) {
                            const payload = {
                                id: user.id,
                                name: user.name,
                                reset: user.reset
                            }
                            jwt.sign(payload, config.JWT, {
                                expiresIn: 3600
                            }, (err, token) => {
                                if (err) console.error('invalid token', err);
                                else {
                                    return res.json({
                                        success: true,
                                        data : {
                                            id : user.id,
                                            name : user.name
                                        },
                                        token: `Bearer ${token}`,
                                    });
                                }
                            });
                        } else {
                            errors.password = 'Incorrect Password';
                            return res.status(400).json({
                                status: false,
                                message: "invalid credentials"
                            });
                        }
                    });
            })
            .catch(err => {
                console.error(err);
                return res.json({
                    status: false,
                    message: err
                })
            })
    },
    me: (req, res) => {
        return res.json({
            id: req.user.id,
            name: req.user.name,
            email: req.user.email,
            year: req.user.year
        });
    },
    reset: async (req, res) => {
        console.log("Reset password")
        let email = req.query.email;
        if (isEmpty(email)) {
            return res.status(400).json({
                status: false,
                message: "invalid request"
            });
        }
        let newPassword = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

        console.log(newPassword);

        User.findOne({
            email
        }, async function (err, user) {
            console.log(user)
            if (err) {
                return res.status(400).json({
                    status: false,
                    message: "invalid request"
                });
            }

            if (!user) {
                console.log('User not found!!!');
                return res.status(400).json({
                    status: true,
                    message: 'Password reset successfully'
                });
            }

            try {
                ses.sendResetMail(email, newPassword);
            } catch (err) {
                console.log(err);
            }

            bcrypt.genSalt(config.SALT, (err, salt) => {
                if (err) console.error('There was an error', err);
                else {
                    bcrypt.hash(newPassword, salt, (err, hash) => {
                        if (err) console.error('There was an error', err);
                        else {
                            user.password = hash
                            user.reset = true
                            user
                                .save()
                                .then(() => {
                                    return res.json({
                                        status: true,
                                        message: "Password reset done"
                                    })
                                })
                                .catch(err => {
                                    return res.json({
                                        status: false,
                                        message: JSON.stringify(err)
                                    })
                                })

                        }
                    });
                }
            });

        });

    },
    changePassword: (req, res) => {
        const {
            errors,
            isValid
        } = validation.validateChangePassword(req.body);

        if (!isValid) {
            return res.status(400).json({
                status: false,
                message: errors
            });
        }

        let email = req.user.email;
        console.log(req.user)
        User.findOne({
                email
            })
            .then(user => {
                if (!user) {
                    return res.json({
                        status: false,
                        message: "Unable to change password"
                    })
                }

                bcrypt.compare(req.body.password, user.password)
                    .then(isMatch => {
                        if (isMatch) {
                            bcrypt.genSalt(config.SALT, (err, salt) => {
                                if (err) console.error('There was an error', err);
                                else {
                                    bcrypt.hash(req.body.npassword, salt, (err, hash) => {
                                        if (err) console.error('There was an error', err);
                                        else {
                                            user.password = hash
                                            user.reset = false
                                            user
                                                .save()
                                                .then(() => {
                                                    return res.json({
                                                        status: true,
                                                        message: "Password changed successfully"
                                                    })
                                                })
                                                .catch(err => {
                                                    return res.json({
                                                        status: false,
                                                        message: "unable to save the changes"
                                                    })
                                                })

                                        }
                                    });
                                }
                            });
                        } else {
                            errors.password = 'Incorrect Password';
                            return res.status(400).json({
                                status: false,
                                message: "invalid credentials"
                            });
                        }
                    }).catch(err => {
                        return res.json({
                            status: false,
                            message: "invalid credentials"
                        })
                    })


            })
            .catch(err => {
                console.log(err)
                return res.json({
                    status: false,
                    message: JSON.stringify(err)
                })
            })
    }
}