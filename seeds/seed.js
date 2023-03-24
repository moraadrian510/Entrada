const sequelize = require("../config/connection");
const { User, Comment } = require("../models");

const userData = require("./userData.json");
const  commentData = require("./commentData.json");

const seedDatabase = async () => {
  await sequelize.sync({ force: true });

  await User.bulkCreate(userData, {
    individualHooks: true,
    returning: true,
  });

  //iterates through all comments
  for (const comment of commentData) {
    await Comment.create({
      ...comment,
      user_id: users[Math.floor(Math.random() * users.length)].id
    });
  }



  process.exit(0);
};

seedDatabase();
