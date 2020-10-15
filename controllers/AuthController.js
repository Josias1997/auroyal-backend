const User = require('./../models/User');
const bcrypt = require('bcryptjs');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const login = (req, res) => {
    username = req.body.username;
    password = req.body.password;

    User.findOne({email: username})
        .exec((err, user) => {
            if (user) {
                bcrypt.compare(req.body.password, user.password, (err, result) => {
                    if (result) {
                        res.status(200).json({user: user});
                    }
                    else {
                        res.status(404).json({
                            error: 'Mot de passe incorrect'
                        })
                    }
                })
            } else {
                console.log(err);
                res.status(404).json({
                    error: "Nom d'utilisateur incorrect"
                })
            }
    });
};

const register = (req, res) => {
    const user = new User(req.body);

    User.findOne({email: user.email})
        .then((result) => {
            if(result) {
                res.status(404).json({
                    error: "Cet email existe déjà"
                });
            } else {
                bcrypt.genSalt(10, (err, salt) => {
                    if (err) {
                        console.log(err);
                        res.status(500).json({
                            error: "Une erreur est survenue au niveau du serveur"
                        })
                    }
                    bcrypt.hash(user.password, salt, (err, hash) => {
                        if (err) {
                            console.log(err);
                            res.status(500).json({
                                error: "Une erreur est survenue au niveau du serveur"
                            })
                        }
                        const creditCardInfo = user.creditCardInfo.split('_');
                        const number = creditCardInfo[0].replace(/\s/g, '');
                        const exp_month = parseInt(creditCardInfo[1].split('/')[0]);
                        const exp_year = parseInt(`20${creditCardInfo[1].split('/')[1]}`);
                        const cvc = creditCardInfo[2]
                        stripe.paymentMethods.create({
                            type: 'card',
                            card: {
                              number: number,
                              exp_month: exp_month,
                              exp_year: exp_year,
                              cvc: cvc,
                            },
                        }).then(paymentMethod => {
                            user.paymentMethodId = paymentMethod.id;
                            stripe.customers.create({
                                address: {
                                 line1: user.address   
                                },
                                description: 'Un client au niveau du restaurant au Royal',
                                email: user.username,
                                name: user.fullName,
                                payment_method: paymentMethod.id,
                                phone: user.contact
                            }).then(customer => {
                                console.log("Customer", customer);
                                user.password = hash;
                                user.customerId = customer.id;
                                user.save((err, user) => {
                                    if (err) {
                                        console.log(err);
                                        res.status(500).json({
                                            error: "Une erreur est survenue au niveau du serveur"
                                        })
                                    }
                                    else if (user) {
                                        res.status(200).json({user: user});
                                    }
                                })
                            }).catch(error => {
                                console.log(error);
                                res.status(500).json({
                                    error: "Erreur lors de l'enregistrement de la carte"
                                }) 
                            })
                        }).catch(error => {
                            console.log(error);
                            res.status(404).json({
                                error: "Erreur lors de l'enregistrement de la carte"
                            })
                        })
                    })
                })
            }
        }).catch(err => { 
            console.log(err);  
            res.status(500).json({
                error: "Erreur serveur"
            })
        })
};

module.exports = {
    login,
    register
}