const jwt = require("jsonwebtoken");
const { secret } = require("../env");

module.exports = (req, res, next) => {
	try {
		let token = req.headers.authorization.split(" ")[1] || undefined;
		if (token) {
			jwt.verify(token, secret);
			next();
		} else {
			res.status(401).json({
				success: false,
				message: "No token provided!",
			});
		}
	} catch (error) {
		res.status(401).json({
			success: false,
			message: "Authentication failed!",
		});
	}
};
