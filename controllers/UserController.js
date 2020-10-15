const User = require('./../models/User');
const bcrypt = require('bcryptjs');
const mail = require('./../utils/mail');
const setPassword = require('./../utils/setPassword');
const stripe = require('stripe')('sk_test_rRU8WPZxcJ6K2wDntvpDFezH00dst7iywd');
const getCreditCardInfo = require('./../utils/getCreditCardInfo');

const getUsers = (req, res) => {
    User.find({})
        .sort({title: 1})
        .then(users => {
            res.status(200).json({users: users});
        }).catch(err => {
            res.status(404).json({
                error: err.message
            })
        })

}

const getUser = (req, res) => {
    User.findById(req.params.id)
        .then(user => {
            if (user === null) {
              res.status(404).json({
                  error: 'This user doesn\'t exists'
              })  
            } else {
                res.status(200).json({user: user})
            }
        }).catch(err => {
            res.status(404).json({
                error: err.message
            })
        })

};

const updateUser = (req, res) => {
    const user = new User({
        _id: req.params.id,
        ...req.body,
    });
    User.findByIdAndUpdate(req.params.id, user)
        .then(user => {
            if (user === null) {
              res.status(404).json({
                  error: 'This user doesn\'t exists'
              })  
            } else {
                User.findById(user._id)
                .then(user => {
                    res.status(200).json({user: user})
                }).catch(err => {
                    res.status(404).json({
                        error: err.message
                    });  
                })
            }
        }).catch(err => {
            res.status(404).json({
                error: err.message
            })
        })

};

const updatePassword = (req, res) => {
    const lastPassword = req.body.lastPassword;
    const newPassword = req.body.newPassword;
       
    User.findById(req.params.id)
    .then(user => {
        if(user === null) {
            res.status(404).json({
                error: 'This user doesn\'t exists'
            })  
        } else {
            bcrypt.compare(lastPassword, user.password, (err, result) => {
                if (result) {
                    setPassword(user, newPassword, res);
                }
                else {
                    res.status(404).json({
                        error: 'Mot de passe incorrect'
                    })
                }
            })
        }
    })
};

const resetPassword = (req, res) => {
    const email = req.body.email
    User.findOne({email: email})
    .then(user => {
        if(user === null) {
            res.status(404).json({
                error: "Cet email n'existe pas dans la base de données"
            })
        } else {
            setPassword(user, `${user.username}1234`, res);
            const info = mail(process.env.USER_EMAIL, user.email, 'Réinitialisation Mot de passe', "<h4>Nouveau mot de passe : </h4>" + `${user.username}1234`);
            res.status(200).json({
                info: info
            })
        }
    })
}

const patchUser = (req, res) => {
    const newUser = {
        ...req.body,
    };
    User.findById(req.params.id)
        .then(user => {
            if (user === null) {
              res.status(404).json({
                  error: 'This user doesn\'t exists'
              })  
            } else {
                if (newUser.creditCardInfo && user.creditCardInfo !== newUser.creditCardInfo) {
                    const {number, exp_month, exp_year, cvc} = getCreditCardInfo.getCrediCardInfo(newUser.creditCardInfo);
                    stripe.paymentMethods.create({
                        type: 'card',
                        card: {
                            number: number,
                            exp_month: exp_month,
                            exp_year: exp_year,
                            cvc: cvc
                        }
                    }).then(paymentMethod => {
                        stripe.paymentMethods.attach(
                            paymentMethod.id,
                            {customer: user.customerId}
                        ).then(paymentMethod => {
                            customer = stripe.customers.update(
                                user.customerId,
                                {invoice_settings: {
                                        default_payment_method: paymentMethod.id
                                    }
                                }
                            ).then(customer => {
                                user.paymentMethodId = paymentMethod.id;
                                Object.keys(newUser).map(key => {
                                    user[key] = newUser[key];
                                });
                                user.save().then(user => {
                                    res.status(200).json({user: user});
                                });
                            }).catch(error => {
                                console.log(error);
                                res.status(500).json({
                                    error: 'Une erreur est survenue lors de la modification des informations de votre carte'
                                })
                            });
                        }).catch(error => {
                            console.log(error);
                            res.status(500).json({
                                error: 'Une erreur est survenue lors de la modification des informations de votre carte'
                            })
                        });
                    }).catch(error => {
                        console.log(error);
                        res.status(500).json({
                            error: 'Une erreur est survenue lors de la modification des informations de votre carte'
                        })
                    })
                }
                else {
                    Object.keys(newUser).map(key => {
                        user[key] = newUser[key];
                    })
                    user.save().then(user => {
                        res.status(200).json({user: user});
                    });
                }
            }
        }).catch(err => {
            console.log(err);
            res.status(404).json({
                error: err.message
            })
        })

};

const deleteUser = (req, res) => {
    User.findByIdAndDelete(req.params.id)
        .then((user) => {
            if (user === null) {
              res.status(404).json({
                  error: 'This user doesn\'t exists'
              })  
            } else {
                res.json({success: true})
            }
        })
        .catch(err => {
            res.status(404).json({
                error: err.message
            })
        })
};

module.exports = {
    getUsers,
    getUser,
    updateUser,
    patchUser,
    deleteUser,
    updatePassword,
    resetPassword
}