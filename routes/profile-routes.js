"use strict";

const express = require("express");
const router = express.Router();
const middleware = require("../middleware");


router.get('/profile', middleware.requireLogin, (req, res) => {
	const payload = {
		pageTitle: `Profile of ${req.session.user.username}`,
		user: req.session.user,
		userJS: JSON.stringify(req.session.user),
		showNav: true,
		profileUser: req.session.user
	}
	res.render("profile-page", payload);
});

router.get('/profile/:username', middleware.requireLogin, (req, res) => {
	const payload = {
		pageTitle: `Profile of ${req.session.user.username}`,
		user: req.session.user,
		userJS: JSON.stringify(req.session.user),
		showNav: true,
		profileUser: req.session.user,
		username: JSON.stringify(req.params.username)
	}
	res.render("profile-page", payload);
});


module.exports = router;
