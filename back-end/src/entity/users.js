/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
    return sequelize.define("users", {
        id: {
            type: DataTypes.INTEGER(20),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            field: 'id'
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'username'
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'email'
        },
        mobile: {
            type: DataTypes.STRING(12),
            allowNull: true,
            field: 'mobile'
        },
        password: {
            allowNull: false,
            type: DataTypes.STRING,
            field: 'password'
        },
        roleId: {
            type: DataTypes.INTEGER(20),
            allowNull: false,
            field: 'role_id'
        }
    }, {
        timestamps: false,
        tableName: 'users'
    })
};