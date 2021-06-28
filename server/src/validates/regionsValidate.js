import ValidateJoi, { noArguments } from '../utils/validateJoi';
import viMessage from '../locales/vi';
import { sequelize } from '../db/db';
import regexPattern from '../utils/regexPattern';
import { parseSort, parseSortVer3 } from '../utils/helper';
const DEFAULT_SCHEMA = {
  regionName: ValidateJoi.createSchemaProp({
    string: noArguments,
    label: viMessage['api.regions.regionName']
  })
};

export default {
  authenCreate: (req, res, next) => {
    console.log('validate authenCreate');

    const { regionName } = req.body;
    const province = {
      regionName
    };

    const SCHEMA = ValidateJoi.assignSchema(DEFAULT_SCHEMA, {
      regionName: {
        max: 100,
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
    const { regionName } = req.body;
    const province = {
      regionName
    };
    const SCHEMA = ValidateJoi.assignSchema(DEFAULT_SCHEMA, {
      regionName: {
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
      const { id, regionName } = JSON.parse(filter);
      const province = {
        id,
        regionName
      };

      const SCHEMA = {
        id: ValidateJoi.createSchemaProp({
          string: noArguments,
          label: viMessage['api.regions.id'],
          regex: regexPattern.listIds
        }),
        ...DEFAULT_SCHEMA
      };

      // console.log('input: ', input);
      ValidateJoi.validate(province, SCHEMA)
        .then(data => {
          if (id) {
            ValidateJoi.transStringToArray(data, 'id');
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
