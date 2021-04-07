// Database infomation
const DB_PORT = '3306'
const SQL_SERVER = "localhost"
const SQL_DATABASE = "gr1"
const SQL_USER = "root"
const SQL_PASSWORD = "nguyengoc1417a1" // your sql's passowrd
const SQL_POOL_MAX = 50
const SQL_POOL_MIN = 0
const SQL_POOL_CONNECTION_TIMEOUT = 1000000
const SQL_POOL_IDLE_TIMEOUT_MILLIS = 1000000
const { result } = require('lodash')
const { Sequelize, DataTypes, Op } = require('sequelize');

const sequelize = new Sequelize(SQL_DATABASE, SQL_USER, SQL_PASSWORD, {
    host: SQL_SERVER,
    port: DB_PORT,
    dialect: 'mysql',
    operatorsAliases: false,

    pool: {
        max: SQL_POOL_MAX,
        min: SQL_POOL_MIN,
        acquire: SQL_POOL_CONNECTION_TIMEOUT,
        idle: SQL_POOL_IDLE_TIMEOUT_MILLIS
    }
});

const users = sequelize.define("users", {
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
    mobile: {
        type: DataTypes.STRING(12),
        allowNull: true,
        field: 'mobile'
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'email'
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
});

const roles = sequelize.define("roles", {
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

const employer = sequelize.define("employer", {
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
        field: 'introduce'
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
});

const jobker = sequelize.define("jobker", {
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
        field: 'job_position'
    }
}, {
    timestamps: false,
    tableName: 'jobker'
});
//roles(1)- (n)users
roles.hasMany(users, { foreignKey: 'roleId', as: 'users' });
users.belongsTo(roles, { foreignKey: 'roleId', as: 'role' });
// users(1) - (1)employer
users.hasOne(employer, { foreignKey: 'userId', as: 'employer' });
employer.belongsTo(users, { foreignKey: 'userId', as: 'user' });

// users(1) - (1)employer
users.hasOne(jobker, { foreignKey: 'userId', as: 'jobker' });
jobker.belongsTo(users, { foreignKey: 'userId', as: 'user' });



(async() => {
    await sequelize.sync({ alter: true });
    // await roles.create({ name: 'jobker' });
    // await roles.create({ name: 'employer' })
    // await roles.create({ name: 'admin' })
    const result = await users.findAll({
        include: {
            model: roles,
            as: "role"
        }
    })
    console.log(result)
})();