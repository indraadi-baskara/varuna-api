const env = require("../env");
const { Sequelize } = require("sequelize");

class DatabaseConnection {
	constructor({ database, username, password, hostname, DBDriver }) {
		this.config = {
			database,
			username,
			password,
			hostname,
			DBDriver,
		};
	}

	async connect() {
		const { database, username, password, hostname, DBDriver } = this.config;

		this.sequelize = new Sequelize(database, username, password, {
			host: hostname,
			dialect: DBDriver,
			dialectOptions: {
				connectTimeout: env.dbConnectTimeout,
			},
		});

		try {
			await this.sequelize.authenticate();
			console.log("Connection has been established successfully.");
			return this.sequelize;
		} catch (error) {
			console.error("Unable to connect to the database:", "ETIMEDOUT");
			this.sequelize = false;
			return this.sequelize;
		}
	}
}

module.exports = DatabaseConnection;
