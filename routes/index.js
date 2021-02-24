const express = require("express");
const router = express.Router();
const Authentication = require("./Authentication");
const AuthMiddleware = require("../middleware/Auth");

const Sales = require("./sales");
const Outlets = require("./Outlets");

router.post("/auth/login", Authentication.login);
router.get("/sales/target/:outletName/:year/:month", Sales.index);
router.get("/outlets", Outlets.index);
router.get("/outlets/is_online/:outletName", Outlets.isOnline);
router.post("/outlets", Outlets.create);

module.exports = router;
