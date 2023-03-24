"use strict";

const express = require("express");
const router = express.Router();
const middleware = require("../middleware");

router.get('/post/:id', middleware.requireLogin, (req, res) => {
	const payload = {
		pageTitle: "View Post",
		user: req.session.user,
		userJS: JSON.stringify(req.session.user),
		showNav: true,
		isPostPage: true,
		postId: JSON.stringify(req.params.id)
	}
	res.render("post-page", payload);
});


module.exports = router;