const express = require("express");
const router = express.Router();
const postsController = require("../../controller/post-controller");


router.get("/api/posts", postsController.getPosts);
router.post("/api/posts", postsController.sendPost);
router.put("/api/posts/:id/like", postsController.likePost);
router.post("/api/posts/:id/retweet", postsController.retweetPost);

module.exports = router;