'use strict';
const { Model, ENUM } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Posts extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            this.belongsTo(models.Users, {
                targetKey: 'userId',
                foreignKey: 'userId',
            });
        }
    }
    Posts.init(
        {
            postId: {
                primaryKey: true,
                type: DataTypes.INTEGER,
            },
            title: DataTypes.STRING,
            content: DataTypes.STRING,
            status: {
                type: ENUM('FOR_SALE', 'SOLD_OUT'),
                defaultValue: 'FOR_SALE',
            },
            userId: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: 'Posts',
        }
    );
    return Posts;
};
