const { QueryTypes } = require("sequelize");
const OutletList = require("../../helpers/OutletLists");
const DatabaseConnection = require("../../helpers/DatabaseConnection");
const SalesQuery = require("../../helpers/SalesQuery");

const formatDate = (date) => {
	let newDate = new Date(date);
	let day = newDate.getDate();
	let month = newDate.getMonth() + 1;
	let year = newDate.getFullYear();
	return `${day} / ${month} / ${year}`;
};

class Sales {
	static async index(req, res, next) {
		const { outletName, year, month } = req.params;
		const outlet = OutletList[outletName];
		let output = {
			success: false,
			name: outlet["name"],
			tahun: parseInt(year),
			bulan: parseInt(month),
			result: [],
		};

		try {
			const database = new DatabaseConnection(outlet);
			const databaseConnection = await database.connect();

			let reportsTarget = await databaseConnection.query(
				SalesQuery.reportTarget(year, month),
				{
					type: QueryTypes.SELECT,
				}
			);

			reportsTarget.map((report) => {
				for (const key in report) {
					if (key === "tgl_jual") {
						report[key] = formatDate(report[key]);
					}
					report.TARGET = parseInt(report.TOTAL);
					if (key !== "tgl_jual") {
						report[key] = 0;
					}
				}
			});

			let reports = await databaseConnection.query(
				SalesQuery.report(year, month),
				{
					type: QueryTypes.SELECT,
				}
			);

			reports.map((report) => {
				report.TARGET = 0;
				for (const key in report) {
					if (key === "tgl_jual") {
						report[key] = formatDate(report[key]);
					}
					if (key !== "tgl_jual") {
						report[key] = parseInt(report[key]) || 0;
					}
				}

				let existInReportTarget = reportsTarget
					.map((item) => item.tgl_jual)
					.indexOf(report.tgl_jual);

				if (existInReportTarget != "-1") {
					let target = reportsTarget[existInReportTarget];
					report.TARGET =
						report.TOTAL === target.TARGET
							? target.TARGET - report.TARGET
							: target.TARGET;
					reportsTarget.splice(existInReportTarget, existInReportTarget + 1);
				}
			});

			output.result = [...reports, ...reportsTarget];
			output.success = output.result.length > 0 ? true : false;
		} catch (error) {
			console.log("somethings wrong, i can feel it => ", error);
		}

		res.json(output);
	}
}

module.exports = Sales;
