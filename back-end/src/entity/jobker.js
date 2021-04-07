/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
    return sequelize.define("jobker", {
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
        address: {
            type: DataTypes.STRING,
            field: 'address'
        },
        academic: {
            type: DataTypes.STRING,
            field: 'academic'
        },
        avatar: {
            type: DataTypes.STRING,
            field: 'avatar'
        },
        cv: {
            type: DataTypes.STRING,
            field: 'cv'
        },
        jobPosition: {
            type: DataTypes.STRING,
            field: 'job_position',
            get() {
                const rawValue = this.getDataValue('jobPosition');
                return rawValue ? rawValue.split('&&') : null;
            },
            set(val) {
                this.setDataValue('jobPosition', val.join('&&'));
            },
        }
    }, {
        timestamps: false,
        tableName: 'jobker'
    })
};