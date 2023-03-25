"use strict";

const express = require("express");
const router = express.Router();
const middleware = require("../middleware");
const userController = require("../controller/user-controller");


router.get("/", middleware.requireLogin, async (req, res) => {
	const payload = {
		pageTitle: "Home",
		user: req.session.user,
		userJS: JSON.stringify(req.session.user),
		showNav: true,
		isHome: true
	};
	
	res.render("home", payload);
});

router.get("/login", async (req, res) => {
	const payload = {
		pageTitle: "Login",
		showNav: false
	};
	
	res.render("login", payload);
});

router.get("/register", async (req, res) => {
	const payload = {
		pageTitle: "Register",
		showNav: false
	};
	
	res.render("register", payload);
});

router.get("/logout", async (req, res) => {
	if (req.session) {
		req.session.destroy(() => {
			res.redirect("/login");
		});
	}
});


router.post("/register", userController.createUser);
router.post("/login", userController.loginUser);

module.exports = router;
