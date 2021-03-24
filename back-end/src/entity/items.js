/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('items', {
        id: {
            type: DataTypes.INTEGER(20),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            field: 'id'
        },
        name: {
            type: DataTypes.STRING(45),
            field: 'name'
        }
    }, {
        tableName: 'items',
        timestamps: false
    });
};