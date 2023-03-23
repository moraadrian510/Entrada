const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

class Comment extends Model {}

Comment.init(
  {
      comment_text: {
          type: DataTypes.STRING,
          allowNull: false,
      },
  },
  {
      sequelize,
  }
);

module.exports = Comment;
