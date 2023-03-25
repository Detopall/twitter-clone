"use strict";

const express = require("express");
const router = express.Router();
const middleware = require("../middleware");
const TwitterUser = require("../models/TwitterUser");


router.get('/profile', middleware.requireLogin, async (req, res) => {
	const payload = {
		pageTitle: `Page of ${req.session.user.username}`,
		user: req.session.user,
		userJS: JSON.stringify(req.session.user),
		profileUser: req.session.user,
		showNav: true,
	}
	res.render("profile-page", payload);
});

router.get('/profile/:username', middleware.requireLogin, async (req, res) => {
	const payload = await getPayload(req.params.username, req.session.user);
	res.render("profile-page", payload);
});

async function getPayload(username, userLoggedIn){
	let user = await TwitterUser.findOne({username: username});

	if (!user) {
		return {
			pageTitle: "User Not Found",
			user: userLoggedIn,
			userJS: JSON.stringify(userLoggedIn),
			showNav: true
		}
	}

	return {
		pageTitle: `Page of ${user.username}`,
		user: userLoggedIn,
		userJS: JSON.stringify(userLoggedIn),
		profileUser: user,
		showNav: true
	}
}


module.exports = router;
