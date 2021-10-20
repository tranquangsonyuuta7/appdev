'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Accounts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Accounts.belongsTo(models.Role, {
        foreignKey: 'roleId',
        onDelete: 'CASCADE'
      })
    }
  };
  Accounts.init({
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    roleId: DataTypes.STRING,
    userId: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Accounts',
  });
  return Accounts;
};