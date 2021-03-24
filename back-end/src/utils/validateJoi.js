import Joi from '../utils/joi/lib/index';

import _ from 'lodash';

const noArguments = { noArguments : true };

export { noArguments, Joi };

/**
 *
 */
export default class ValidateJoi {

  /**
   *
   * @param {*} schema
   * @param {*} updates
   */
  static assignSchema(schema, updates) {
    const copySchema = _.assign({}, schema);

    _.forIn(updates, (v, k) => {
      copySchema[k] = Object.keys(v).reduce(
        (schemaProp, opsK) => {
          // console.log("opsK: %o , schemaProp: %o, schemaProp[opsK]: %o", opsK, schemaProp, schemaProp[opsK])
          return v[opsK] === noArguments ? schemaProp[opsK]() : schemaProp[opsK](v[opsK])
        }
        , copySchema[k]);
    });

    return copySchema;
  }

  /**
   *
   * @param {*} options
   */
  static createSchemaProp(options) {
    return Object.keys(options).reduce((r, k) => options[k] === noArguments ? r[k]() : r[k](options[k])
    , Joi);
  }

  /**
   *
   * @param {*} objectSchemas
   */
  static createArraySchema(objectSchemas) {
    return Joi.array().items(objectSchemas);
  }

  /**
   *
   * @param {*} object
   */
  static createObjectSchema(object) {
    return Joi.object(object);
  }

  /**
   * Utility helper for Joi validation.
   *
   * @param   {object}  data
   * @param   {object}  schema
   * @returns {Promise}
   */
  static validate(data, schema) {
    data = _.pickBy(data, (prop) => prop !== undefined);

    return Joi.validate(data, schema, { abortEarly: false }, err => {

      if (err) {
        return Promise.reject(err);
      }

      return Promise.resolve(data);
    });
  }

  /**
   *
   * @param {*} obj
   * @param {*} key
   */
  static transStringToArray(obj, key) {
    const arr = obj[key].split(',');

    if (arr.length === 1) {
      obj[key] = parseInt(obj[key]);
    } else {
      obj[key] = arr.map(n => parseInt(n));
      obj[key] = {
        "$in": obj[key]
      };
    }

    return obj;
  }
}
