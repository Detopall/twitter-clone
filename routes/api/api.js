const express = require("express");
const router = express.Router();
const postsController = require("../../controller/post-controller");


router.post("/api/posts", postsController.sendPost);

module.exports = router;