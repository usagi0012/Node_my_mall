'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Users extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            this.hasMany(models.Posts, {
                sourceKey: 'userId',
                foreignKey: 'userId',
            });
        }
    }
    Users.init(
        {
            userId: {
                primaryKey: true,
                type: DataTypes.INTEGER,
            },
            email: DataTypes.STRING,
            name: DataTypes.STRING,
            password: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: 'Users',
        }
    );
    return Users;
};
