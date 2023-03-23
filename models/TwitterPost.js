"use strict";

const mongoose = require("mongoose");
const { Schema } = mongoose;
require("dotenv").config({path: './config/config.env'});

const PostSchema = new mongoose.Schema({
	content: {
		type: String,
		trim: true
	},
	postedBy: {
		type: Schema.Types.ObjectId,
		ref: "TwitterUser",
		pinned: Boolean
	}
}, {timestamps: true});


module.exports = mongoose.model('TwitterPost', PostSchema);