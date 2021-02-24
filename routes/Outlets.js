const OutletLists = require("../helpers/OutletLists");
const DatabaseConnection = require("../helpers/DatabaseConnection");

class Outlets {
	static async isOnline(req, res, next) {
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

	static async index(req, res, next) {
		const outletConfig = Object.values(OutletLists).map((outlet) => {
			return {
				name: outlet.name,
				hostname: outlet.serverAlias,
				status: outlet.status,
				img: outlet.img,
			};
		});

		res.json(outletConfig);
	}
	static async create(req, res, next) {}
	static async update(req, res, next) {}
	static async delete(req, res, next) {}
}

module.exports = Outlets;
