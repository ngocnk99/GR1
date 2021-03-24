/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
    return sequelize.define("employerProfile", {
        id: {
            type: DataTypes.INTEGER(20),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            field: 'id'
        },
        companyName: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'company_name'
        },
        companyWebsite: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'company_website'
        },
        address: {
            allowNull: false,
            type: DataTypes.STRING,
            field: 'address'
        },
        introduce: {
            allowNull: false,
            type: DataTypes.STRING,
            field: 'introduce'
        },
        banner: {
            allowNull: false,
            type: DataTypes.STRING,
            field: 'banner'
        },
        avatar: {
            allowNull: false,
            type: DataTypes.STRING,
            field: 'avatar'
        },
        member: {
            allowNull: false,
            type: DataTypes.STRING,
            field: 'member'
        }
    }, {
        timestamps: false,
        tableName: 'employer_profile'
    })
};