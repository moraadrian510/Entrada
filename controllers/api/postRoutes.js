const router = require("express").Router();
const { Post } = require("../../models");
const withAuth = require("../../utils/auth");

router.post("/", withAuth, async (req, res) => {
  try {
    const newPost = await Post.create({
      ...req.body,
      //  property is set to the ID of the user who is currently logged in
      user_id: req.session.user.id,
    });

    res.status(200).json(newPost);
  } catch (err) {
    res.status(404).json(err);
  }
});

router.delete("/:id", withAuth, async (req, res) => {
  try {
    const commentData = await Comment.destroy({
      where: {
        id: req.session.user.id,
        user_id: req.session.user.id,
      },
    });
    if (!commentData) {
      res.status(404).json({ message: "No post found with this id!" });
    }
    res.status(200).json(commentData);
  } catch (err) {
    res.status(404).json(err);
  }
});

module.exports = router;
