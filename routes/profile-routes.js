"use strict";

const express = require("express");
const router = express.Router();
const middleware = require("../middleware");
const TwitterUser = require("../models/TwitterUser");


router.get('/profile', middleware.requireLogin, async (req, res) => {
	const payload = {
		pageTitle: req.session.user.username,
		user: req.session.user,
		userJS: JSON.stringify(req.session.user),
		profileUser: req.session.user,
		profileUserJS: JSON.stringify(req.session.user),
		showNav: true,
		isProfilePage: true,
		selectedTab: JSON.stringify("posts")
	}
	res.render("profile-page", payload);
});

router.get('/profile/:username', middleware.requireLogin, async (req, res) => {
	const payload = await getPayload(req.params.username, req.session.user);
	res.render("profile-page", payload);
});

router.get('/profile/:username/replies', middleware.requireLogin, async (req, res) => {
	const payload = await getPayload(req.params.username, req.session.user);
	payload.selectedTab = JSON.stringify("replies");
	res.render("profile-page", payload);
});

async function getPayload(username, userLoggedIn){
	let user = await TwitterUser.findOne({username: username}).lean();

	if (!user) {
		return {
			pageTitle: "User Not Found",
			user: userLoggedIn,
			userJS: JSON.stringify(userLoggedIn),
			showNav: true
		}
	}

	return {
		pageTitle: user.username,
		user: userLoggedIn,
		userJS: JSON.stringify(userLoggedIn),
		profileUser: user,
		profileUserJS: JSON.stringify(user),
		showNav: true,
		isProfilePage: true,
		selectedTab: JSON.stringify("posts")
	}
}


module.exports = router;
