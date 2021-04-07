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
        postId: {
            type: DataTypes.INTEGER(20),
            field: 'post_id'
        },
        jokerId: {
            type: DataTypes.INTEGER(20),
            field: 'post_id'
        },
        time: {
            type: DataTypes.STRING,
            field: 'time'
        },
        employerNotify: {
            type: DataTypes.INTEGER(20), //0: có người ứng tuyển vào nhưng chưa xem , 1 : ứng tuyển vào đã xem
            field: 'employer_notify'
        },
        jobkerNotify: {
            type: DataTypes.INTEGER(20), //0: đã ứng tuyển , 1: được chấp nhận nhưng chưa xem  ,2: được chấp nhận nhưng đã xem
            field: 'jobker_notify' // 3: bị từ chối nhưng chưa xem, 4:bị từ chối và đã xem
        }
    }, {
        timestamps: false,
        tableName: 'employer_profile'
    })
};