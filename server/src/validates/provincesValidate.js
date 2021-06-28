import ValidateJoi, { noArguments } from '../utils/validateJoi';
import viMessage from '../locales/vi';
import { sequelize } from '../db/db';
import regexPattern from '../utils/regexPattern';
import { parseSort, parseSortVer3 } from '../utils/helper';
const DEFAULT_SCHEMA = {
  provinceName: ValidateJoi.createSchemaProp({
    string: noArguments,
    label: viMessage['api.provinces.provinceName']
  }),
  regionsId: ValidateJoi.createSchemaProp({
    number: noArguments,
    label: viMessage['api.provinces.regionsId']
  }),
  provinceSchedule: ValidateJoi.createSchemaProp({
    array: noArguments,
    label: viMessage['api.provinces.provinceSchedule'],
    allow: ['[]', null]
  })
};

export default {
  authenCreate: (req, res, next) => {
    console.log('validate authenCreate');

    const { provinceName, regionsId, provinceSchedule } = req.body;
    const province = {
      provinceName,
      regionsId,
      provinceSchedule
    };

    const SCHEMA = ValidateJoi.assignSchema(DEFAULT_SCHEMA, {
      provinceName: {
        max: 100,
        required: noArguments
      },
      regionsId: {
        required: noArguments
      },
      provinceSchedule: {
        required: noArguments
      }
    });

    // console.log('input: ', input);
    ValidateJoi.validate(province, SCHEMA)
      .then(data => {
        res.locals.body = data;
        next();
      })
      .catch(error => next({ ...error, message: 'Định dạng gửi đi không đúng' }));
  },
  authenUpdate: (req, res, next) => {
    const { provinceName, regionsId, provinceSchedule } = req.body;
    const province = {
      provinceName,
      regionsId,
      provinceSchedule
    };
    const SCHEMA = ValidateJoi.assignSchema(DEFAULT_SCHEMA, {
      provinceName: {
        max: 100
      }
    });

    ValidateJoi.validate(province, SCHEMA)
      .then(data => {
        res.locals.body = data;
        next();
      })
      .catch(error => {
        next({ ...error, message: 'Định dạng gửi đi không đúng' });
      });
  },
  authenFilter: (req, res, next) => {
    console.log('validate authenFilter');
    const { filter, sort, range, attributes } = req.query;

    res.locals.sort = parseSort(sort);
    res.locals.range = range ? JSON.parse(range) : [0, 49];
    res.locals.attributes = attributes;
    if (filter) {
      const { id, provinceName, regionsId, provinceSchedule } = JSON.parse(filter);
      const province = {
        id,
        provinceName,
        regionsId,
        provinceSchedule
      };
      // console.log('input: ', req.query);
      const SCHEMA = {
        id: ValidateJoi.createSchemaProp({
          string: noArguments,
          label: viMessage['api.provinces.id'],
          regex: regexPattern.listIds
        }),
        ...DEFAULT_SCHEMA
      };

      ValidateJoi.validate(province, SCHEMA)
        .then(data => {
          if (id) {
            ValidateJoi.transStringToArray(data, 'id');
          }
          if (regionsId) {
            ValidateJoi.transStringToArray(data, 'regionsId');
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
  }
};
