import ValidateJoi, { noArguments } from '../utils/validateJoi';
import viMessage from '../locales/vi';
import regexPattern from '../utils/regexPattern';
import { parseSort } from '../utils/helper';
const DEFAULT_SCHEMA = {
  userGroupName: ValidateJoi.createSchemaProp({
    string: noArguments,
    label: viMessage['api.userGroups.userGroupName']
  }),
  userGroupDescriptions: ValidateJoi.createSchemaProp({
    string: noArguments,
    label: viMessage['api.userGroups.userGroupDescriptions'],
    allow: [null, '']
  }),
  userCreatorsId: ValidateJoi.createSchemaProp({
    number: noArguments
  }),
  dateCreated: ValidateJoi.createSchemaProp({
    date: noArguments
  }),
  dateUpdated: ValidateJoi.createSchemaProp({
    date: noArguments
  }),
  status: ValidateJoi.createSchemaProp({
    number: noArguments
  })
};

export default {
  authenCreate: (req, res, next) => {
    // console.log("validate authenCreate")
    const userCreatorsId = req.auth.userId;

    const { userGroupName, dateCreated, dateUpdated, userGroupDescriptions, status } = req.body;
    const userGroup = { userGroupName, dateCreated, dateUpdated, userGroupDescriptions, status, userCreatorsId };

    const SCHEMA = ValidateJoi.assignSchema(DEFAULT_SCHEMA, {
      userGroupName: {
        max: 100,
        required: noArguments
      },
      status: {
        required: noArguments
      }
    });

    // console.log('input: ', input);
    ValidateJoi.validate(userGroup, SCHEMA)
      .then(data => {
        res.locals.body = data;
        next();
      })
      .catch(error => next({ ...error, message: 'Định dạng gửi đi không đúng' }));
  },
  authenUpdate: (req, res, next) => {
    // console.log("validate authenUpdate")

    const { userGroupName, dateCreated, dateUpdated, userGroupDescriptions, status } = req.body;
    const userGroup = { userGroupName, dateCreated, dateUpdated, userGroupDescriptions, status };

    const SCHEMA = ValidateJoi.assignSchema(DEFAULT_SCHEMA, {
      userGroupName: {
        max: 100
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
    // console.log("validate authenFilter")
    const { filter, sort, range, attributes } = req.query;

    res.locals.sort = parseSort(sort);
    res.locals.range = range ? JSON.parse(range) : [0, 49];
    res.locals.attributes = attributes;

    if (filter) {
      const { id, userGroupName, status, FromDate, ToDate } = JSON.parse(filter);
      const district = { id, userGroupName, status, FromDate, ToDate };

      // console.log(district)
      const SCHEMA = {
        id: ValidateJoi.createSchemaProp({
          string: noArguments,

          regex: regexPattern.listIds
        }),
        ...DEFAULT_SCHEMA,
        FromDate: ValidateJoi.createSchemaProp({
          date: noArguments
        }),
        ToDate: ValidateJoi.createSchemaProp({
          date: noArguments
        })
      };

      // console.log('input: ', input);
      ValidateJoi.validate(district, SCHEMA)
        .then(data => {
          if (id) {
            ValidateJoi.transStringToArray(data, 'id');
          }
          res.locals.filter = data;
          // console.log('locals.filter', res.locals.filter);
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
  authenUpdate_status: (req, res, next) => {
    // console.log("validate authenCreate")
    const usersCreatorsId = req.auth.userId;
    console.log('validate authenCreate', usersCreatorsId);
    const { status, dateUpdated } = req.body;
    const userGroup = { status, dateUpdated, usersCreatorsId };

    const SCHEMA = {
      status: ValidateJoi.createSchemaProp({
        number: noArguments,
        required: noArguments
      }),
      dateUpdated: ValidateJoi.createSchemaProp({
        date: noArguments,
        required: noArguments
      }),
      usersCreatorsId: ValidateJoi.createSchemaProp({
        number: noArguments,
        required: noArguments
      })
    };

    ValidateJoi.validate(userGroup, SCHEMA)
      .then(data => {
        res.locals.body = data;
        next();
      })
      .catch(error => next({ ...error, message: 'Định dạng gửi đi không đúng' }));
  }
};
