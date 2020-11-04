const { QueryTypes } = require("sequelize");
const OutletList = require("../../helpers/OutletLists");
const DatabaseConnection = require("../../helpers/DatabaseConnection");

class Sales {
	static async index(req, res, next) {
		const { outletName, year, month } = req.params;
		const outlet = OutletList[outletName];
		let result = {};

		try {
			const database = new DatabaseConnection(outlet);
			const databaseConnection = await database.connect();

			const query = `SELECT
		    d.*
		  FROM (
		    SELECT
		      b.tgl_jual,
		      SUM(c.FOOD) AS FOOD,
		      SUM(c.bev) AS BEV,
		      SUM(c.bev1) AS BEV1,
		      SUM(c.CIGARETTE) AS CIGARETTE,
		      SUM(c.MINIBAR) AS MINIBAR,
		      SUM(b.tot_gross) AS JUMLAH,
		      SUM(b.tot_service) AS TAX,
		      SUM(b.tot_tax) AS SERVICE,
		      SUM(b.tot_grand) AS TOTAL
		    FROM karaoke.t_jual AS b
		    LEFT JOIN (
		      SELECT
		        a.kd_jual,
		        SUM(IF(a.nm_kat = 'FOOD', a.jml_jual * a.hrg_jual, 0)) AS FOOD,
		        SUM(IF(a.nm_kat = 'BEV', a.jml_jual * a.hrg_jual, 0)) AS bev,
		        SUM(IF(a.nm_kat = 'BEV1', a.jml_jual * a.hrg_jual, 0)) AS bev1,
		        SUM(IF(a.nm_kat = 'CIGARETTE', a.jml_jual * a.hrg_jual, 0)) AS CIGARETTE,
		        SUM(IF(a.nm_kat = 'MINIBAR', a.jml_jual * a.hrg_jual, 0)) AS MINIBAR
		      FROM karaoke.t_jual_detail AS a
		      GROUP BY a.kd_jual) AS c
		    ON b.kd_jual = c.kd_jual
		    GROUP BY b.tgl_jual
		  ) AS d
		  WHERE YEAR(d.tgl_jual) = ${year}
		  AND MONTH(d.tgl_jual) = ${month}
		  `;

			result = await databaseConnection.query(query, {
				type: QueryTypes.SELECT,
			});
		} catch (error) {
			console.log("somethings wrong, i can feel it => ", error);
		}

		res.json(result);
	}
}

module.exports = Sales;
