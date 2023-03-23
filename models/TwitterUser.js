"use strict";

const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require('bcryptjs');
require("dotenv").config({path: './config/config.env'});
const SALT_NUM = process.env.SALT_NUM;

const UserSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
	firstname: {
		type: String,
		required: true,
	},
	lastname: {
		type: String,
		required: true,
	},
	profilePic: {
		type: String,
		default: "/images/profilePic.png"
	},
	likes: [{type: Schema.Types.ObjectId, ref: "TwitterPost"}],
	retweets: [{type: Schema.Types.ObjectId, ref: "TwitterPost"}]
	
}, {timestamps: true});

UserSchema.pre("save", async function (next) {
	try {
		const salt = bcrypt.genSaltSync(parseInt(SALT_NUM));
		const hashedPwd = await bcrypt.hash(this.password, salt);
		this.password = hashedPwd;
		next();
	} catch (err) {
		next(err);
	}
});

module.exports = mongoose.model('TwitterUser', UserSchema);