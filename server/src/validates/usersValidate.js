import ValidateJoi, { noArguments } from '../utils/validateJoi';
import viMessage from '../locales/vi';
import { sequelize } from '../db/db';
import regexPattern from '../utils/regexPattern';
import { parseSort, parseSortVer3 } from '../utils/helper';
const DEFAULT_SCHEMA = {
  username: ValidateJoi.createSchemaProp({
    string: noArguments,
    label: viMessage['api.users.username']
  }),
  password: ValidateJoi.createSchemaProp({
    string: noArguments,
    label: viMessage['api.users.password']
  }),

  userGroupsId: ValidateJoi.createSchemaProp({
    number: noArguments
  }),
  status: ValidateJoi.createSchemaProp({
    number: noArguments
  }),
  dateUpdated: ValidateJoi.createSchemaProp({
    date: noArguments,
    label: viMessage['api.users.dateUpdated']
  }),
  dateCreated: ValidateJoi.createSchemaProp({
    date: noArguments,
    label: viMessage['api.users.dateCreated']
  })
};

export default {
  authenCreate: (req, res, next) => {
    console.log('validate authenCreate');
    const { username, userGroupsId, status, dateUpdated, dateCreated, password } = req.body;

    const user = {
      username,
      userGroupsId,
      status,
      dateUpdated,
      dateCreated,
      password
    };

    const SCHEMA = Object.assign(
      ValidateJoi.assignSchema(DEFAULT_SCHEMA, {
        username: {
          regex: /\w/i,
          max: 100,
          required: true
        },
        password: {
          min: 6,
          max: 200
        },
        userGroupsId: {
          required: noArguments
        },
        status: {
          required: noArguments
        }
      })
    );

    // console.log('input: ', input);
    ValidateJoi.validate(user, SCHEMA)
      .then(data => {
        res.locals.body = data;
        next();
      })
      .catch(error => next({ ...error, message: 'Định dạng gửi đi không đúng' }));
  },
  authenUpdate: (req, res, next) => {
    console.log('validate authenUpdate');

    const {
      username,

      userGroupsId,
      status,
      dateUpdated,
      dateCreated,
      password
    } = req.body;

    const user = {
      username,

      userGroupsId,
      status,
      dateUpdated,
      dateCreated,
      password
    };

    const SCHEMA = Object.assign(
      ValidateJoi.assignSchema(DEFAULT_SCHEMA, {
        username: {
          regex: /\w/i,
          max: 100,
          required: true
        },
        fullname: {
          max: 200
        }
      })
    );

    ValidateJoi.validate(user, SCHEMA)
      .then(data => {
        res.locals.body = data;
        next();
      })
      .catch(error => next({ ...error, message: 'Định dạng gửi đi không đúng' }));
  },
  authenUpdate_status: (req, res, next) => {
    // console.log("validate authenCreate")
    const userCreatorsId = req.auth.userId || 0;

    const { status, dateUpdated } = req.body;
    const userGroup = { status, dateUpdated };

    const SCHEMA = ValidateJoi.assignSchema(DEFAULT_SCHEMA, {
      status: {
        required: noArguments
      },
      dateUpdated: {
        required: noArguments
      }
    });

    ValidateJoi.validate(userGroup, SCHEMA)
      .then(data => {
        res.locals.body = data;
        next();
      })
      .catch(error => next({ ...error, message: 'Định dạng gửi đi không đúng' }));
  },
  authenFilter: (req, res, next) => {
    console.log('validate authenFilter');
    const { filter, sort, range, attributes } = req.query;

    res.locals.sort = parseSort(sort);
    res.locals.range = range ? JSON.parse(range) : [0, 49];
    res.locals.attributes = attributes;
    if (filter) {
      const {
        id,
        username,

        userGroupsId,
        status,
        FromDate,
        ToDate
      } = JSON.parse(filter);
      const user = { id, username, userGroupsId, status, FromDate, ToDate };

      console.log(user);
      const SCHEMA = {
        ...DEFAULT_SCHEMA,
        id: ValidateJoi.createSchemaProp({
          string: noArguments,
          label: viMessage['api.users.id'],
          regex: regexPattern.listIds
        }),

        userGroupsId: ValidateJoi.createSchemaProp({
          string: noArguments,

          regex: regexPattern.listIds
        }),
        FromDate: ValidateJoi.createSchemaProp({
          date: noArguments
        }),
        ToDate: ValidateJoi.createSchemaProp({
          date: noArguments
        })
      };

      // console.log('input: ', input);
      ValidateJoi.validate(user, SCHEMA)
        .then(data => {
          if (id) {
            ValidateJoi.transStringToArray(data, 'id');
          }
          if (userGroupsId) {
            ValidateJoi.transStringToArray(data, 'userGroupsId');
          }
          res.locals.filter = data;
          console.log('locals.filter', res.locals.filter);
          next();
        })
        .catch(error => {
          next({ ...error, message: 'Định dạng gửi đi không đúng' });
        });
    } else {
      res.locals.filter = {};
      next();
    }
  },

  authenFilterbyUserGroups: (req, res, next) => {
    console.log('validate authenLoginSocical', req.body);
    const { filter, sort, range } = req.query;

    res.locals.sort = parseSortVer3(sort, 'ecommerceProducts');
    res.locals.range = range ? JSON.parse(range) : [0, 49];

    if (filter) {
      const { fullname, userGroupsId, locations } = JSON.parse(filter);

      const user = {
        fullname,
        userGroupsId,
        locations
      };

      const SCHEMA = {
        fullname: ValidateJoi.createSchemaProp({
          string: noArguments,
          label: viMessage['api.users.fullname']
        }),
        userGroupsId: ValidateJoi.createSchemaProp({
          string: noArguments,
          label: viMessage['api.groupUser.id'],
          required: true
        }),
        locations: ValidateJoi.createSchemaProp({
          array: noArguments,
          label: viMessage.address
        })
      };

      // console.log('input: ', input);
      ValidateJoi.validate(user, SCHEMA)
        .then(data => {
          res.locals.filter = data;
          console.log('locals.filter', res.locals.filter);
          next();
        })
        .catch(error => {
          next({ ...error, message: 'Định dạng gửi đi không đúng' });
        });
    } else {
      res.locals.filter = {};
      next();
    }
  }
};
