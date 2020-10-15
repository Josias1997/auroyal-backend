const stripe = require('stripe')("sk_test_rRU8WPZxcJ6K2wDntvpDFezH00dst7iywd");
const User = require('./../models/User');

const handlePayment = (req, res) => {
    const data = {
        ...req.body
    };
    console.log(data);
    User.findById(data.id)
    .then(user => {
        console.log(user);
        const PaymentIntent = stripe.paymentIntents.create({
            amount: data.amount * 100,
            currency: "eur",
            customer: user.customerId,
            payment_method: user.paymentMethodId,
            error_on_requires_action: true,
            confirm: true
        }).then(paymentIntent => {
            res.status(200).json({
                message: paymentIntent.id
            })
        }).catch(error => {
            console.log(error);
            res.status(404).json({
                error: "Une erreur est survenue lors du paiement"
            })
        })
    }).catch(error => {
        console.log(error);
        res.status(404).json({
            error: "Une erreur est survenue lors du paiement"
        })
    })
}

module.exports = {
    handlePayment
}

