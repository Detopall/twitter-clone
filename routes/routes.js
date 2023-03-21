const express = require("express");
const router = express.Router();


router.get("/", async (req, res) => {
	const payload = {
		"pageTitle": "Home"
	};
	
	res.render("home", payload);
});

module.exports = router;
