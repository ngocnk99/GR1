// import moment from 'moment'
import MODELS from '../models/models';
import models from '../entity/index';
import _ from 'lodash';
import * as ApiErrors from '../errors';
import ErrorHelpers from '../helpers/errorHelpers';
import filterHelpers from '../helpers/filterHelpers';
import preCheckHelpers, { TYPE_CHECK } from '../helpers/preCheckHelpers';

const { regions /* tblGatewayEntity, Roles */, provinces } = models;

export default {
  get_list: param =>
    new Promise(async (resolve, reject) => {
      try {
        const { filter, range, sort, attributes } = param;
        console.log(sort);

        let whereFilter = filter;
        const att = filterHelpers.atrributesHelper(attributes);

        try {
          whereFilter = filterHelpers.combineFromDateWithToDate(whereFilter);
        } catch (error) {
          reject(error);
        }

        const perPage = range[1] - range[0] + 1;
        const page = Math.floor(range[0] / perPage);

        whereFilter = await filterHelpers.makeStringFilterRelatively(['regionName'], whereFilter, 'regions');

        if (!whereFilter) {
          whereFilter = { ...filter };
        }

        console.log('where', whereFilter);

        MODELS.findAndCountAll(regions, {
          where: whereFilter,
          order: sort,
          // attributes: att,
          offset: range[0],
          limit: perPage,
          distinct: true,
          logging: console.log,
          include: [{ model: provinces, as: 'provinces', required: true, attributes: ['id', 'provinceName'] }]
        })
          .then(result => {
            resolve({
              ...result,
              page: page + 1,
              perPage
            });
          })
          .catch(err => {
            reject(ErrorHelpers.errorReject(err, 'getListError', 'regionservice'));
          });
      } catch (err) {
        reject(ErrorHelpers.errorReject(err, 'getListError', 'regionservice'));
      }
    }),
  get_list_multi: param =>
    new Promise(async (resolve, reject) => {
      try {
        const { filter, attributes } = param;
        let whereFilter = filter;
        const att = filterHelpers.atrributesHelper(attributes);
        console.log('where', whereFilter);
        MODELS.findAndCountAll(regions, {
          where: whereFilter,
          attributes: ['point'],
          logging: console.log,
          include: [{ model: provinces, as: 'provinces', required: true, attributes: ['id', 'provinceName'] }]
        })
          .then(result => {
            if (result.count > 0) {
              let point;
              let typePolygon = 0;

              _.forEach(result.rows, function(item) {
                let itemPoint;

                if (item.dataValues.point.type === 'MultiPolygon') {
                  itemPoint = item.dataValues.point.coordinates;
                  typePolygon = 1;
                } else {
                  itemPoint = [item.dataValues.point.coordinates];
                }

                if (point) {
                  point = _.concat(point, itemPoint);
                } else {
                  point = itemPoint;
                }
              });
              // console.log("dffdsfsfsfs 1111")
              // if( _.size(point) < 2 && typePolygon === 0)
              // {
              //   resolve(
              //     {
              //       "type": "Polygon",
              //       "coordinates":point
              //     }
              //   )
              // }
              // else{
              resolve({
                type: 'MultiPolygon',
                coordinates: point
              });
              // }
            } else {
              console.log('dffdsfsfsfs');
              resolve({});
            }
          })
          .catch(err => {
            reject(ErrorHelpers.errorReject(err, 'getListError', 'regionservice'));
          });
      } catch (err) {
        reject(ErrorHelpers.errorReject(err, 'getListError', 'regionservice'));
      }
    }),
  get_one: param =>
    new Promise((resolve, reject) => {
      try {
        // console.log("Menu Model param: %o | id: ", param, param.id)
        const id = param.id;
        const att = filterHelpers.atrributesHelper(param.attributes, ['usersCreatorId']);

        MODELS.findOne(regions, {
          where: { id: id },
          attributes: att,
          include: [{ model: provinces, as: 'provinces', required: true }]
        })
          .then(result => {
            if (!result) {
              reject(
                new ApiErrors.BaseError({
                  statusCode: 202,
                  type: 'crudNotExisted'
                })
              );
            }
            resolve(result);
          })
          .catch(err => {
            reject(ErrorHelpers.errorReject(err, 'getInfoError', 'regionservice'));
          });
      } catch (err) {
        reject(ErrorHelpers.errorReject(err, 'getInfoError', 'regionservice'));
      }
    }),
  create: async param => {
    let finnalyResult;

    try {
      let entity = param.entity;

      console.log('regions create: ', entity);
      let whereFilter = {
        regionName: entity.regionName
      };

      if (entity.provinceIdentificationCode) {
        whereFilter.provinceIdentificationCode = entity.provinceIdentificationCode;
      }
      // api.regions.identificationCode

      // const whereFilterProvinceIdentificationCode = {
      //   provinceIdentificationCode: entity.provinceIdentificationCode
      // };

      whereFilter = await filterHelpers.makeStringFilterAbsolutely(['regionName'], whereFilter, 'regions');

      // const dupProvince = await preCheckHelpers.createPromiseCheckNew(MODELS.findOne(regions,
      //   {
      //     where: whereFilter
      //   }), entity.regionName ? true : false, TYPE_CHECK.CHECK_DUPLICATE,
      //   { parent: 'api.regions.name' }
      // );

      // if (!preCheckHelpers.check([dupProvince])) {
      //   throw new ApiErrors.BaseError({
      //     statusCode: 202,
      //     type: 'getInfoError',
      //     message: 'Không xác thực được thông tin gửi lên'
      //   })
      // }

      const infoArr = Array.from(
        await Promise.all([
          preCheckHelpers.createPromiseCheckNew(
            MODELS.findOne(regions, { where: whereFilter }),
            entity.regionName ? true : false,
            TYPE_CHECK.CHECK_DUPLICATE,
            { parent: 'api.regions.regionName' }
          )
          // preCheckHelpers.createPromiseCheckNew(
          //   MODELS.findOne(regions, { where: whereFilterProvinceIdentificationCode }),
          //   entity.provinceIdentificationCode ? true : false,
          //   TYPE_CHECK.CHECK_DUPLICATE,
          //   { parent: 'api.regions.identificationCode' }
          // )
        ])
      );

      if (!preCheckHelpers.check(infoArr)) {
        throw new ApiErrors.BaseError({
          statusCode: 202,
          type: 'getInfoError',
          message: 'Không xác thực được thông tin gửi lên'
        });
      }

      finnalyResult = await MODELS.create(regions, entity).catch(error => {
        throw new ApiErrors.BaseError({
          statusCode: 202,
          type: 'crudError',
          error
        });
      });

      if (!finnalyResult) {
        throw new ApiErrors.BaseError({
          statusCode: 202,
          type: 'crudInfo'
        });
      }
    } catch (error) {
      ErrorHelpers.errorThrow(error, 'crudError', 'regionservice');
    }

    return { result: finnalyResult };
  },
  update: async param => {
    let finnalyResult;

    try {
      let entity = param.entity;

      console.log('Province update: ');

      const foundProvince = await MODELS.findOne(regions, {
        where: {
          id: param.id
        }
      }).catch(error => {
        throw new ApiErrors.BaseError({
          statusCode: 202,
          type: 'getInfoError',
          message: 'Lấy thông tin của Tỉnh/Thành phố thất bại!',
          error
        });
      });

      if (foundProvince) {
        let whereFilter = {
          id: { $ne: param.id },
          regionName: entity.regionName
        };
        if (entity.provinceIdentificationCode) {
          whereFilter.provinceIdentificationCode = entity.provinceIdentificationCode;
        }
        whereFilter = await filterHelpers.makeStringFilterAbsolutely(['regionName'], whereFilter, 'regions');

        // let whereFilterProvinceIdentificationCode = {
        //   id: { $ne: param.id },
        //   provinceIdentificationCode: entity.provinceIdentificationCode
        // };

        /*
        const dupProvince = await preCheckHelpers.createPromiseCheckNew(MODELS.findOne(regions
          ,{
            where: whereFilter
          })
          , entity.regionName ? true : false, TYPE_CHECK.CHECK_DUPLICATE,
          { parent: 'api.regions.name' }
        );

        if (!preCheckHelpers.check([dupProvince])) {
          throw new ApiErrors.BaseError({
            statusCode: 202,
            type: 'getInfoError',
            message: 'Không xác thực được thông tin gửi lên'
          })
        }*/

        const infoArr = Array.from(
          await Promise.all([
            preCheckHelpers.createPromiseCheckNew(
              MODELS.findOne(regions, { where: whereFilter }),
              entity.regionName ? true : false,
              TYPE_CHECK.CHECK_DUPLICATE,
              { parent: 'api.regions.regionName' }
            )
            // preCheckHelpers.createPromiseCheckNew(
            //   MODELS.findOne(regions, { where: whereFilterProvinceIdentificationCode }),
            //   entity.provinceIdentificationCode ? true : false,
            //   TYPE_CHECK.CHECK_DUPLICATE,
            //   { parent: 'api.regions.identificationCode' }
            // )
          ])
        );

        if (!preCheckHelpers.check(infoArr)) {
          throw new ApiErrors.BaseError({
            statusCode: 202,
            type: 'getInfoError',
            message: 'Không xác thực được thông tin gửi lên'
          });
        }

        await MODELS.update(regions, entity, { where: { id: Number(param.id) } }).catch(error => {
          throw new ApiErrors.BaseError({
            statusCode: 202,
            type: 'crudError',
            error
          });
        });

        finnalyResult = await MODELS.findOne(regions, { where: { id: param.id } }).catch(error => {
          throw new ApiErrors.BaseError({
            statusCode: 202,
            type: 'crudInfo',
            message: 'Lấy thông tin sau khi thay đổi thất bại',
            error
          });
        });

        if (!finnalyResult) {
          throw new ApiErrors.BaseError({
            statusCode: 202,
            type: 'crudInfo',
            message: 'Lấy thông tin sau khi thay đổi thất bại'
          });
        }
      } else {
        throw new ApiErrors.BaseError({
          statusCode: 202,
          type: 'crudNotExisted'
        });
      }
    } catch (error) {
      ErrorHelpers.errorThrow(error, 'crudError', 'regionservice');
    }

    return { result: finnalyResult };
  },
  update_status: param =>
    new Promise((resolve, reject) => {
      try {
        console.log('block id', param.id);
        const id = param.id;
        const entity = param.entity;

        MODELS.findOne(regions, {
          where: {
            id
          },
          logging: console.log
        })
          .then(findEntity => {
            // console.log("findPlace: ", findPlace)
            if (!findEntity) {
              reject(
                new ApiErrors.BaseError({
                  statusCode: 202,
                  type: 'crudNotExisted'
                })
              );
            } else {
              MODELS.update(regions, entity, {
                where: { id: id }
              })
                .then(() => {
                  // console.log("rowsUpdate: ", rowsUpdate)
                  MODELS.findOne(regions, { where: { id: param.id } })
                    .then(result => {
                      if (!result) {
                        reject(
                          new ApiErrors.BaseError({
                            statusCode: 202,
                            type: 'deleteError'
                          })
                        );
                      } else resolve({ status: 1, result: result });
                    })
                    .catch(err => {
                      reject(ErrorHelpers.errorReject(err, 'crudError', 'UserServices'));
                    });
                })
                .catch(err => {
                  reject(ErrorHelpers.errorReject(err, 'crudError', 'UserServices'));
                });
            }
          })
          .catch(err => {
            reject(ErrorHelpers.errorReject(err, 'crudError', 'UserServices'));
          });
      } catch (err) {
        reject(ErrorHelpers.errorReject(err, 'crudError', 'UserServices'));
      }
    }),
  delete: async param => {
    try {
      console.log('delete id', param.id);

      const foundProvince = await MODELS.findOne(regions, {
        where: {
          id: param.id
        }
      }).catch(error => {
        throw new ApiErrors.BaseError({
          statusCode: 202,
          type: 'getInfoError',
          error
        });
      });

      if (!foundProvince) {
        throw new ApiErrors.BaseError({
          statusCode: 202,
          type: 'crudNotExisted'
        });
      } else {
        await MODELS.destroy(regions, { where: { id: parseInt(param.id) } });

        const provinceAfterDelete = await MODELS.findOne(regions, { where: { Id: param.id } }).catch(err => {
          ErrorHelpers.errorThrow(err, 'crudError', 'regionservice');
        });

        if (provinceAfterDelete) {
          throw new ApiErrors.BaseError({
            statusCode: 202,
            type: 'deleteError'
          });
        }
      }
    } catch (err) {
      ErrorHelpers.errorThrow(err, 'crudError', 'regionservice');
    }

    return { status: 1 };
  }
};
