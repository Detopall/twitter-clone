const express = require("express");
const router = express.Router();
const postsController = require("../../controller/post-controller");
const userController = require("../../controller/user-controller");


router.get("/api/posts", postsController.getPosts);
router.post("/api/posts", postsController.sendPost);

router.get("/api/posts/:id", postsController.getPost);
router.delete("/api/posts/:id", postsController.deletePost);

router.put("/api/posts/:id/like", postsController.likePost);
router.post("/api/posts/:id/retweet", postsController.retweetPost);


router.get("/api/users", userController.getUsers);

router.put("/api/profile/image", userController.changeImage);
module.exports = router;