"use strict";

const User = require("../models/TwitterUser");
const bcrypt = require('bcryptjs');


exports.createUser = async (req, res) => {
	console.log(req.body);
	if (await usernameAlreadyExists(req)) {
		const errorMsg = "Username already in use";
		return res.render("register", {errorMsg});
	}

	try {
		const user = new User(req.body);
		await user.save();
		const registeredUser = await User.findById({"_id": user._id}, {"password": 0});
		console.log(registeredUser);
		res.send({user: registeredUser});
	} catch(err) {
		console.error("Cannot register user: ", err);
		const errorMsg = "Could not create user. Please try again later.";
		return res.render("register", { errorMsg });
	}
}

async function usernameAlreadyExists(req){
	const username = req.body.username;
	const users = await User.find({"username": username}).lean();
	return users.length >= 1;
}

exports.loginUser = async (req, res) => {
	if (!await usernameAlreadyExists(req)) {
		const errorMsg = "Username already does not exist";
		return res.render("login", {errorMsg});
	}

	if (!await validPassword(req)) {
		const errorMsg = "Invalid password";
		return res.render("login", {errorMsg});
	}

	try {
		console.log(`${req.body.username} is logged in`);
		const loggedInUser = await User.find({"username": req.body.username}, {"password": 0});
		res.send({user: loggedInUser[0]});
	} catch (err) {
		console.error("Cannot login user: ", err);
		const errorMsg = "Could not login user. Please try again later.";
		return res.render("register", { errorMsg });
	}
}

async function validPassword(req){
	const user = await User.find({"username": req.body.username}).lean();
	return bcrypt.compareSync(req.body.password, user[0].password);
}
