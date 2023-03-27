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
		const newPost = await TwitterPost.findById(post._id).populate("postedBy");
		return res.send(newPost);
	} catch(err){
		console.error(err);
		return res.sendStatus(500);
	}
}


exports.getPosts = async (req, res) => {
	try {
		let searchObj = req.query;
		if (searchObj.isReply){
			const isReply = searchObj.isReply === "true";
			searchObj.replyTo = { $exists: isReply };
			delete searchObj.isReply;
		}
		if (searchObj.search){
			searchObj = { content: { $regex: searchObj.search, $options: 'i' } };
		}
		const results = await findPosts(searchObj);
		res.send(results);
	} catch(err) {
		console.error(err);
		res.sendStatus(500);
	}
}


exports.getPost = async (req, res) => {
	try {
		const postId = req.params.id;
		const postData = await findPosts({_id: postId});

		const results = {
			postData: postData[0]
		}

		if (postData.replyTo){
			results.replyTo = postData.replyTo;
		}
		results.replies = await findPosts( {replyTo: postId} );
		res.send(results);

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

exports.deletePost = async (req, res) => {
	const postId = req.params.id;
	try {
	  // Find the post by id
	  const post = await TwitterPost.findById(postId);
	  if (!post) {
		return res.status(404).send({ error: 'Post not found' });
	  }
	  // Delete the post and all retweets
	  await TwitterPost.deleteMany({ $or: [{ _id: post._id }, { retweetData: post._id }, {replyTo: post._id}] });
	  res.sendStatus(202);
	} catch (err) {
	  console.error(err);
	  res.sendStatus(500);
	}
  };


async function findPosts(filter) {
	try {
		let results = await TwitterPost.find(filter).populate("postedBy").populate("retweetData").populate("replyTo");
		
		results = await TwitterUser.populate(results, {path: "retweetData.postedBy"});
		results = await TwitterUser.populate(results, {path: "replyTo.postedBy"});

		return results;
	} catch(err) {
		console.error(err);
	}
}
