const router = require("express").Router();
const { Post, Comment, User } = require("../../models");
const withAuth = require("../../utils/auth");

//get a single post
router.get("/:id", withAuth, async (req, res) => {
  try {
    const postData = await Post.findByPk(req.params.id, {
      include: [{ model: User }, { model: Comment }],
      attributes: {
        exclude: ["password"],
      },
    });
    res.status(200).json(postData);
  } catch (err) {
    res.status(404).json();
  }
});

//get all posts
router.get("/", withAuth, async (req, res) => {
  try {
    const postData = await Post.findAll({
      include: [{ model: Comment }, { model: User }],
      attributes: {
        exclude: ["password"],
      },
    });
    res.status(200).json(postData);
  } catch (err) {
    res.status.json(err);
  }
});

//update post
router.put("/:id", async (req, res) => {
    try {
    const postData = await Post.update(req.body, { where: {
        id: req.session.user.id,
    },
    });
    if (!postData) {
    res
        .status(404)
        .json({ message: "Error updating post, post with this id not found!" });
    }
    res.status(200).json(postData);
    } catch (err) {
    res.status(404).json();
    }
});

//creating new post
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

//delete post
router.delete("/:id", withAuth, async (req, res) => {
  try {
    const postData = await Post.destroy({
      where: {
        id: req.session.user.id,
        user_id: req.session.user.id,
      },
    });
    if (!postData) {
      res.status(404).json({ message: "No post found with this id!" });
    }
    res.status(200).json(postData);
  } catch (err) {
    res.status(404).json(err);
  }
});

module.exports = router;
