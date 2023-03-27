"use strict";

const express = require("express");
const router = express.Router();

router.get('/search', (req, res) => {
	const payload = givePayload(req);
	res.render("search-page", payload);
});

router.get('/search/profiles', (req, res) => {
	const payload = givePayload(req);
	res.render("search-page", payload);
});

function givePayload(req){
	return {
		pageTitle: "Search",
		user: req.session.user,
		userJS: JSON.stringify(req.session.user),
		showNav: true,
		isSearchPage: true,
	}
}


module.exports = router;