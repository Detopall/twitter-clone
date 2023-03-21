const express = require("express");
const router = express.Router();
const middleware = require("../middleware");


router.get("/", middleware.requireLogin, async (req, res) => {
	const payload = {
		"pageTitle": "Home"
	};
	
	res.render("home", payload);
});


router.get("/login", async (req, res) => {
	const payload = {
		"pageTitle": "Login"
	};
	
	res.render("login", payload);
});

module.exports = router;
