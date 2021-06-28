const SQL_PORT = '3306';
const SQL_SERVER = '127.0.0.1';
const SQL_DATABASE = 'gr2';
const SQL_USER = 'root';
const SQL_PASSWORD = 'Nguyengoc1417a1';
const SQL_POOL_MAX = 50;
const SQL_POOL_MIN = 0;
const SQL_POOL_CONNECTION_TIMEOUT = 1000000;
const SQL_POOL_IDLE_TIMEOUT_MILLIS = 1000000;
const adminUser = 'adminadmin';
const adminPassword = '000000';

const { Sequelize, DataTypes, Op } = require('sequelize');
Sequelize.DATE.prototype._stringify = function _stringify(date, options) {
  return this._applyTimezone(date, options).format('YYYY-MM-DD HH:mm:ss.SSS');
};
const timezone = '+07:00';
const logging = false;

const sequelize = new Sequelize(SQL_DATABASE, SQL_USER, SQL_PASSWORD, {
  host: SQL_SERVER,
  port: SQL_PORT,
  dialect: 'mysql',

  dialectOptions: {
    supportBigNumbers: true,
    bigNumberStrings: true,
    multipleStatements: true,
    charset: 'utf8_general_ci',
    dateStrings: false,
    connectTimeout: SQL_POOL_CONNECTION_TIMEOUT
  },
  pool: {
    max: parseInt(SQL_POOL_MAX),
    min: parseInt(SQL_POOL_MIN),
    acquire: parseInt(SQL_POOL_CONNECTION_TIMEOUT),
    idle: parseInt(SQL_POOL_IDLE_TIMEOUT_MILLIS)
  },
  define: {
    createdAt: true,
    updatedAt: true,
    underscored: true,
    freezeTableName: false,
    charset: 'utf8',
    dialectOptions: {
      multipleStatements: true,
      charset: 'utf8_general_ci'
    },
    timestamps: false,
    timezone // for writng
  },
  timezone, // for writng
  logging
});

const userGroups = sequelize.define(
  'userGroups',
  {
    id: {
      type: DataTypes.BIGINT(20),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: 'id'
    },
    userGroupName: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'userGroupName'
    },
    userGroupDescriptions: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: 'userGroupDescriptions'
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'status'
    }
  },
  {
    tableName: 'userGroups',
    timestamps: false
  }
);
const users = sequelize.define(
  'users',
  {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: 'id'
    },
    username: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'username'
    },
    password: {
      type: DataTypes.STRING(200),
      allowNull: false,
      field: 'password'
    },
    userGroupsId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: 'userGroupsId'
    },
    status: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
      field: 'status'
    },
    dateCreated: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      field: 'dateCreated'
    },
    dateUpdated: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      field: 'dateUpdated'
    }
  },
  {
    tableName: 'users',
    timestamps: false
  }
);

(async () => {
  await sequelize.sync({ alter: true });
  await userGroups.bulkCreate([
    { userGroupName: 'admin', userGroupDescriptions: 'admin', status: 1 },
    { userGroupName: 'employer', userGroupDescriptions: 'Nhà tuyển dụng', status: 1 },
    { userGroupName: 'jobker', userGroupDescriptions: 'Người tìm việc làm', status: 1 }
  ]);
  await users.create({
    username: adminUser,
    password: adminPassword,
    userGroupsId: 1,
    status: 1
  });
})();
