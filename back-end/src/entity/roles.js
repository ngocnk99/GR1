/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
    return sequelize.define("roles", {
        id: {
            type: DataTypes.INTEGER(20),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            field: 'id'
        },
        name: {
            type: DataTypes.STRING
        }
    }, {
        timestamps: false,
        tableName: 'roles'
    });
};