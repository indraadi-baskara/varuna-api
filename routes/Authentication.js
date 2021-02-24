// const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { administrator, secret } = require("../env");

const genereateAccessToken = ({ username, password, expiresIn, secret }) => {
	return jwt.sign({ username, password }, secret, { expiresIn });
};

class Authentication {
	static login(req, res, next) {
		let output = {
			success: false,
			message: "Username or password not found",
		};
		let { username, password } = req.body;
		if (!username || !password) {
			res.status(401).json(output);
		} else if (
			username === administrator.username &&
			password === administrator.password
		) {
			let jwtToken = genereateAccessToken({
				username,
				password,
				secret,
				expiresIn: "1h",
			});

			output.success = true;
			output.message = "success";
			res.status(200).json({
				...output,
				token: jwtToken,
			});
		} else {
			res.status(401).json(output);
		}
	}
}

module.exports = Authentication;
