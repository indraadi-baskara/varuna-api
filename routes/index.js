const express = require("express");
const router = express.Router();
const OutletsList = require("../helpers/OutletLists");

const ConnectionChecker = require("./connectionChecker");
const Sales = require("./sales");

router.get("/target/:outletName/:year/:month", Sales.index);
router.get("/connection/:outletName", ConnectionChecker.outletDatabase);
router.get("/config", (req, res, next) => {
	const outletConfig = Object.values(OutletsList).map((outlet) => {
		return {
			name: outlet.name,
			hostname: outlet.serverAlias,
			status: outlet.status,
			img: outlet.img,
		};
	});
	console.log(outletConfig);

	res.json(outletConfig);
});

module.exports = router;
