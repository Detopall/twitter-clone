"use strict";

exports.sendPost = async (req, res) => {
	if (!req.body.content) {
		return res.sendStatus(400);
	}
	console.log(req.body);
	res.send({data: "This works"});
}