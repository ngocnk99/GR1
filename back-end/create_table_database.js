// Database infomation
const DB_PORT = '3306'
const SQL_SERVER = "localhost"
const SQL_DATABASE = "gr1"
const SQL_USER = "root"
const SQL_PASSWORD = "yourPasswork" // your sql's passowrd
const SQL_POOL_MAX = 50
const SQL_POOL_MIN = 0
const SQL_POOL_CONNECTION_TIMEOUT = 1000000
const SQL_POOL_IDLE_TIMEOUT_MILLIS = 1000000
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

const Users = sequelize.define("users", {
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

const Roles = sequelize.define("roles", {
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

// users(n) - (1) roles
Roles.hasMany(Users, { foreignKey: 'roleId', as: 'users' });
Users.belongsTo(Roles, { foreignKey: 'roleId', as: 'role' });

(async() => {
    await sequelize.sync({ alter: true });
    await Roles.create({ name: 'jobker' });
    await Roles.create({ name: 'employer' })
    await Roles.create({ name: 'admin' })
})();