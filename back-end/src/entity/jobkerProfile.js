/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
    return sequelize.define("jobkerProfile", {
        id: {
            type: DataTypes.INTEGER(20),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            field: 'id'
        },
        address: {
            allowNull: false,
            type: DataTypes.STRING,
            field: 'address'
        },
        academic: {
            allowNull: false,
            type: DataTypes.STRING,
            field: 'academic'
        },
        avatar: {
            allowNull: false,
            type: DataTypes.STRING,
            field: 'avatar'
        },
        cv: {
            allowNull: false,
            type: DataTypes.STRING,
            field: 'cv'
        },
        jobPosition: {
            allowNull: false,
            type: DataTypes.STRING,
            field: 'job_position'
        }
    }, {
        timestamps: false,
        tableName: 'jobker_profile'
    })
};