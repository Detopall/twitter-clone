const express = require("express");
const router = express.Router();
const middleware = require("../middleware");
const userController = require("../controller/user-controller");


router.get("/", middleware.requireLogin, async (req, res) => {
	const payload = {
		"pageTitle": "Home",
		user: req.session.user
	};
	
	res.render("home", payload);
});


router.get("/login", async (req, res) => {
	const payload = {
		"pageTitle": "Login"
	};
	
	res.render("login", payload);
});

router.get("/register", async (req, res) => {
	const payload = {
		"pageTitle": "Register"
	};
	
	res.render("register", payload);
});


router.post("/register", userController.createUser);
router.post("/login", userController.loginUser);

module.exports = router;
