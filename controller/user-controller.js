"use strict";

const User = require("../models/TwitterUser");
const bcrypt = require('bcryptjs');


exports.createUser = async (req, res) => {
	if (await usernameAlreadyExists(req)) {
		const errorMsg = "Username already in use";
		return res.render("register", {errorMsg});
	}

	try {
		const user = new User(req.body);
		await user.save();
		const registeredUser = await User.findById({"_id": user._id}, {"password": 0});
		req.session.user = registeredUser;
		res.redirect("/");

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
	if (!await usernameAlreadyExists(req) || !await validPassword(req)) {
		const errorMsg = "Username or password are invalid";
		return res.render("login", {errorMsg});
	}

	try {
		const loggedInUser = await User.find({"username": req.body.username}, {"password": 0});
		
		//logged in user returns a list of one user
		req.session.user = loggedInUser[0];
		res.redirect("/");

	} catch (err) {
		console.error("Cannot login user: ", err);
		const errorMsg = "Could not login user. Please try again later.";
		return res.render("login", { errorMsg });
	}
}

async function validPassword(req){
	const user = await User.find({"username": req.body.username}).lean();
	return bcrypt.compareSync(req.body.password, user[0].password);
}

exports.getUsers = async (req, res) => {
	try {
		let searchObj = req.query;
		if (searchObj.search){
			searchObj = getSearchObjUsers(searchObj);
		}
		const results = await findUsers(searchObj);
		res.send(results);
	} catch(err) {
		console.error(err);
		res.sendStatus(500);
	}
}

function getSearchObjUsers(searchObj) {
	return {
		$or: [
		  { username: { $regex: searchObj.search, $options: "i" } },
		  { firstName: { $regex: searchObj.search, $options: "i" } },
		  { lastName: { $regex: searchObj.search, $options: "i" } }
		]
	  }
}

async function findUsers(filter){
	try {
		return await User.find(filter).lean();
	} catch(err) {
		console.error(err);
	}
}