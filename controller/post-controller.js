"use strict";

const TwitterPost = require("../models/TwitterPost");

exports.sendPost = async (req, res) => {
	if (!req.body.content) {
		return res.sendStatus(400);
	}
	const post = new TwitterPost({
		content: req.body.content,
		postedBy: req.session.user
	});
	try {
		await post.save();
		const newPost = await TwitterPost.findById(post._id).populate('postedBy');
		return res.send(newPost);
	} catch(err){
		return res.sendStatus(500);
	}
}
