"use strict";

const TwitterPost = require("../models/TwitterPost");
const TwitterUser = require("../models/TwitterUser");

exports.sendPost = async (req, res) => {
	if (!req.body.content) {
		return res.sendStatus(400);
	}
	const postData = {
		content: req.body.content,
		postedBy: req.session.user
	};

	if (req.body.replyTo){
		postData.replyTo = req.body.replyTo;
	}

	const post = new TwitterPost(postData);
	try {
		await post.save();
		const newPost = await TwitterPost.findById(post._id).populate('postedBy');
		return res.send(newPost);
	} catch(err){
		console.error(err);
		return res.sendStatus(500);
	}
}


exports.getPosts = async (req, res) => {
	try {
		const results = await findPosts({});
		res.send(results);
	} catch(err) {
		console.error(err);
		res.sendStatus(500);
	}
}

exports.getPost = async (req, res) => {
	try {
		const postId = req.params.id;
		const results = await findPosts({_id: postId});
		res.send(results[0]); //only one result, so first index
	} catch(err) {
		console.error(err);
		res.sendStatus(500);
	}
}

exports.likePost = async (req, res) => {
	const userId = req.session.user._id;
	const postId = req.params.id;

	const isLiked = req.session.user.likes && req.session.user.likes.includes(postId);
	const option = isLiked ? "$pull" : "$addToSet";
	
	// Insert user like
	try {
		req.session.user = await TwitterUser.findOneAndUpdate(
			{_id: userId},
			{[option]:{ likes: postId }},
			{new: true});
	} catch(err) {
		console.error(err);
		res.sendStatus(500);
	}

	// Insert post like
	try {
		const post = await TwitterPost.findOneAndUpdate(
			{_id: postId},
			{ [option]: { likes: userId }},
			{new: true});
		return res.send(post);
	} catch(err) {
		console.error(err);
		res.sendStatus(500);
	}
}


exports.retweetPost = async (req, res) => {
	const userId = req.session.user._id;
	const postId = req.params.id;

	// Delete retweet to check if it has existed

	const deletedPost = await TwitterPost.findOneAndDelete({
		postedBy: userId,
		retweetData: postId
	})
	.catch(err => {
	console.error(err);
	res.sendStatus(500)});


	// Insert post retweet
	const option = deletedPost != null ? "$pull" : "$addToSet";
	let repost = deletedPost;

	if (!repost) {
		repost = await TwitterPost.create({
			postedBy: userId,
			retweetData: postId
		});

		try {
			req.session.user = await TwitterUser.findOneAndUpdate(
				{_id: userId},
				{[option]:{ retweets: repost._id }},
				{new: true}
				);
		} catch(err) {
			console.error(err);
			res.sendStatus(500);
		}
	}

	// adding the users to retweet users
	const post = await TwitterPost.findOneAndUpdate(
		{_id: postId},
		{ [option]: { retweetUsers: userId }},
		{new: true})
		.catch(err => {
			console.error(err);
			res.sendStatus(500)});
	
	return res.send(post);
}


async function findPosts(filter) {
	try {
		const posts = await TwitterPost.find(filter).populate('postedBy').populate("retweetData").populate("replyTo");
		
		const populatedReply = await TwitterPost.populate(posts, {path: "replyTo.postedBy"});
		const populatedRetweetData = await TwitterPost.populate(populatedReply, {path: "retweetData.postedBy"});

		return populatedRetweetData;
	} catch(err) {
		console.error(err);
	}
}