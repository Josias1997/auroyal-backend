const bcrypt = require('bcryptjs');

const setPassword = (user, password, res) => {
	bcrypt.genSalt(10, (err, salt) => {
        if (err) {
            res.status(500).json({
                error: "Une erreur est survenue au niveau du serveur"
            })
        }
        else {
            bcrypt.hash(password, salt, (err, hash) => {
                if (err) {
                    res.status(500).json({
                        error: "Une erreur est survenue au niveau du serveur"
                    })
                }
                else {
                    user.password = hash;
                    user.save((err, user) => {
                        if (err) {
                            res.status(500).json({
                                error: "Une erreur est survenue au niveau du serveur"
                            })
                        }
                        else if (user) {
                            res.status(200).json({user: user});
                        }
                    })
                }
            })

        }
    })
}

module.exports = setPassword;