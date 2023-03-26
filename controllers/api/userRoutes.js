const router = require("express").Router();
const { User, Comment } = require('../../models');


//Get all users
router.get('/', async (req, res) => {
  try {
    const userData = await User.findAll({
      exclude: ['password']
    });
    res.status(200).json(userData);
  } catch (err) {
    res.status(404).json(err);
  };
});

//Get a specific user
router.get('/:id', async (req, res) => {
  try {
    const userData = await User.findByPk(req.params.id, {
     where: {
      id: req.params.id
     },
     include: [{
      model: Post,
      attributes: ['id', 'title', 'content', 'created_at']
     }],

    });

    if (!userData) {
      res.status(404).json({ message: 'No user with that id found !'})
    }
    res.status(200).json(userData);
  } catch (err) {
    res.status(404).json(err);
  };
});

//update a specific user
router.put('/:id', async (req, res) => {
  try {
    const userData = await User.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    if (!userData[0]) {
      res.status(404).json({ message: 'No user with this id!' });
      return;
    }
    res.status(200).json(userData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Create a user
router.post('/', async (req, res) => {
  try {
    const newUser = await User.create(req.body);

    req.session.save(() => {
      req.session.user_id = newUser.id;
      req.session.logged_in = true;

      res.status(200).json(newUser);
    });
  } catch (err) {
    res.status(400).json(err);
  }
});

//delete a user
router.delete('/:id', async (req, res) => {
  try {
    const delUser = await User.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id
    }
    });

    if (!delUser) {
      res.status(404).json({ message: `User with that id not found!`})
    }
  }catch (err) {
    res.status(400).json(err)
  }
});

//authenticating user login information 
router.post("/login", async (req, res) => {
  try {
    const userData = await User.findOne({ where: { email: req.body.email } });

    if (!userData) {
      res
        .status(400)
        .json({ message: "Incorrect email or password, please try again" });
      return;
    }

    const validPassword = await userData.checkPassword(req.body.password);

    if (!validPassword) {
      res
        .status(400)
        .json({ message: "Incorrect email or password, please try again" });
      return;
    }

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;

      res.json({ user: userData, message: "You are now logged in!" });
    });
  } catch (err) {
    res.status(400).json(err);
  }
});

//endind user session when logged off
router.post('/logout', (req, res) => {
    if (req.session.logged_in) {
      req.session.destroy(() => {
        res.status(204).end();
      });
    } else {
      res.status(404).end();
    }
  });
  
  module.exports = router;