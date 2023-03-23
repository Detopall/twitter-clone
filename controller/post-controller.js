"use strict";

exports.sendPost = async (req, res) => {
	console.log(req.body);
	res.send({data: "This works"});
}