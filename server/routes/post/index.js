const express = require("express");
const { upload } = require("../../middleware/media");
const isAuthenticate = require("../../middleware/isAuthenticate");
const router = express.Router();

// controller
const {
  likePost,
  createPost,
  updatePost,
  deletePost,
  unlikePost,
  getPostDetail,
  getPublicPosts,
  getPostsFromFollowings,
} = require("../../controller/post");
const { updateComment, getComments } = require("../../controller/comment");

router.post(
  "/",
  upload("image").array("images", 5),
  isAuthenticate,
  createPost
);
router.put(
  "/:postId",
  isAuthenticate,
  upload("image").array("images", 5),
  updatePost
);
router.delete("/:postId", isAuthenticate, deletePost);

router.get("/public", getPublicPosts);
router.get("/:postId", getPostDetail);
router.get("/followings", isAuthenticate, getPostsFromFollowings);

router.post("/", isAuthenticate, createPost);
router.delete("/:postId", isAuthenticate, deletePost);
router.put("/:postId", isAuthenticate, updatePost);

// like & unlike a post
router.post("/:postId/like", isAuthenticate, likePost);
router.delete("/:postId/like", isAuthenticate, unlikePost);

// comment a post
router.get("/:postId/comments", isAuthenticate, getComments);
router.post("/:postId/comments", isAuthenticate, updateComment);

// Bookmark posts
// router.post("/api/posts/:postId/bookmark", isAuthenticate);
// router.delete("/api/posts/:postId/bookmark", isAuthenticate);

module.exports = router;
