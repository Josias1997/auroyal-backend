const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    fullName: {
        type: String,
        required: true
    },
    contact: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    points: {
        type: Number,
        default: 0
    },
    customerId: {
        type: String,
        required: true
    },
    paymentMethodId: {
        type: String,
        required: true
    },
    firebaseId: {
        type: String,
        required: true
    },
    creditCardInfo: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now()
    }
});

module.exports = User = mongoose.model('User', UserSchema);