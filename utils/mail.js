const nodemailer = require('nodemailer');

const sendMail = (from, to, subject, html) => {
	const transporter = nodemailer.createTransport({
		service: process.env.USER_HOST,
		auth: {
			user: process.env.USER_EMAIL,
			pass: process.env.USER_PASSWORD
		}
	});

	const mailOptions = {
		from: from,
		to: to,
		subject: subject,
		html: html
	};
	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			console.log(error);
			return error;
		} else {
			console.log(info);
			return info;
		}
	})
}

module.exports = sendMail;