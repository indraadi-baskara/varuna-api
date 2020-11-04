const OutletLists = require("../helpers/OutletLists");
const DatabaseConnection = require("../helpers/DatabaseConnection");

class ConnectionChecker {
	static async outletDatabase(req, res, next) {
		const { outletName } = req.params;

		const outlet = OutletLists[outletName];
		const outletConnectionStatus = {
			name: outlet.name,
			hostname: outlet.serverAlias,
			status: outlet.status,
		};

		try {
			const database = new DatabaseConnection(outlet);
			const connection = await database.connect();
			connection.authenticate();
			outletConnectionStatus.status = "online";
			res.json(outletConnectionStatus);
		} catch (error) {
			outletConnectionStatus.status = "offline";
			res.json(outletConnectionStatus);
		}
	}
}

module.exports = ConnectionChecker;
