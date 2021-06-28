/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    'users',
    {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: 'id'
      },
      username: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'username'
      },
      password: {
        type: DataTypes.STRING(200),
        allowNull: false,
        field: 'password'
      },
      userGroupsId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: 'userGroupsId'
      },
      status: {
        type: DataTypes.INTEGER(10),
        allowNull: false,
        field: 'status'
      },
      dateCreated: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        field: 'dateCreated'
      },
      dateUpdated: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        field: 'dateUpdated'
      }
    },
    {
      tableName: 'users',
      timestamps: false
    }
  );
};
