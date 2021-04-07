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
        employerId: {
            type: DataTypes.INTEGER(20),
            field: 'post_id'
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'introduce'
        },
        introduce: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'introduce'
        },
        request: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'request'
        },
        benefitsEnjoyed: {
            type: DataTypes.STRING(12),
            allowNull: true,
            field: 'benefits_enjoyed'
        },
        career: {
            allowNull: false,
            type: DataTypes.STRING,
            field: 'career'
        },
        dateline: {
            allowNull: false,
            type: DataTypes.STRING,
            field: 'dateline'
        },
        numberOfPeople: {
            allowNull: false,
            type: DataTypes.STRING,
            field: 'number_of_people'
        },
        experience: {
            allowNull: false,
            type: DataTypes.STRING,
            field: 'experience'
        },
        salary: {
            allowNull: false,
            type: DataTypes.STRING,
            field: 'salary'
        },
        sex: {
            allowNull: false,
            type: DataTypes.INTEGER(4),
            field: 'sex'
        },
        status: { //0:chờ kiểm duyệt , 1: đã kiểm duyệt nhưng chưa xem thông báo ,2: đã kiểm duyệt 
            allowNull: false, //3: đã xóa nhưng chưa xem thông báo ,4: đã xóa nhưng và đã xem thông báo
            type: DataTypes.BOOLEAN, //4:đã khôi phục nhưng chưa xem thông báo ,5:đã khôi phục nhưng và đã xem thông báo
            field: 'status'
        },
        time: {
            type: DataTypes.STRING,
            field: 'time'
        },
    }, {
        timestamps: false,
        tableName: 'users'
    })
};