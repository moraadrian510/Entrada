const router = require("express").Router();
const { Comment, Post, User } = require("../../models");
const withAuth = require("../../utils/auth");

// create new comment
router.post("/", withAuth, async (req, res) => {
  try {
    const commentData = await Comment.create({
      comment_text: req.body.comment_text,
    });
    res.status(200).json(commentData);
  } catch (err) {
    res.status(404).json(err);
  }
});

//Get all comments
router.get("/", async (req, res) => {
  try {
    const commentData = await Comment.findAll();
    res.status(200).json(commentData);
  } catch (err) {
    res.status(404).json(err);
  }
});

//Get a single comment
router.get("/:id", async (req, res) => {
  try {
    const commentData = await Comment.findByPk(req.params.id);
    if (!commentData) {
      res.status(404).json({ message: "No user with that id found!" });
    }
    res.status(200).json(commentData);
  } catch (err) {
    res.status(404).json(err);
  }
});

//Update a comment
router.put("/:id", withAuth, async (req, res) => {
  try {
    const commentData = await Comment.update(req.body, {
      where: { id: req.params.id, user_id: req.session.userId },
    });
    res.status(200).json(commentData);
  } catch (err) {
    res.status(404).json(err);
  }
});

//Delete a comment
router.delete("/:id", withAuth, async (req, res) => {
  try {
    const commentData = await Comment.destroy({
      where: {
        id: req.session.comment.id,
      },
    });
    res.status(200).json(commentData);
  } catch (err) {
    res.status(404).json(err);
  }
});

module.exports = router;
