/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
    return sequelize.define("employer", {
        id: {
            type: DataTypes.INTEGER(20),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            field: 'id'
        },
        userId: {
            type: DataTypes.INTEGER(20),
            field: 'user_id'
        },
        companyName: {
            type: DataTypes.STRING,
            field: 'company_name'
        },
        companyWebsite: {
            type: DataTypes.STRING,
            field: 'company_website'
        },
        address: {
            type: DataTypes.STRING,
            field: 'address'
        },
        introduce: {
            type: DataTypes.STRING,
            field: 'introduce',
            get() {
                return this.getDataValue('introduce').split('&&')
            },
            set(val) {
                this.setDataValue('introduce', val.join('&&'));
            },
        },
        banner: {
            type: DataTypes.STRING,
            field: 'banner'
        },
        avatar: {
            type: DataTypes.STRING,
            field: 'avatar'
        },
        member: {
            type: DataTypes.STRING,
            field: 'member'
        }
    }, {
        timestamps: false,
        tableName: 'employer'
    })
};