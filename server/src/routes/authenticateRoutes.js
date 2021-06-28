import { Router } from 'express';
import jwt from 'jsonwebtoken';
import Joi from '../utils/joi/lib';
import Model from '../models/models';
import models from '../entity/index';
import { Op } from 'sequelize';
import CONFIG from '../config';
import validate from '../utils/validate';
import { encryptedString, verifyPasswordMd5, md5 } from '../utils/crypto';
import * as ApiErrors from '../errors';
import ErrorHelpers from '../helpers/errorHelpers';

const { users } = models;
const router = Router();

router.get('/generate/data/login', async (req, res, next) => {
  const { userName, password } = req.body;
  const data = await encryptedString(`${userName}|${password}`, 'nbm@2018');

  console.log('data: ', data);
  res.send(data);
});

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const validateAuthen = (req, res, next) => {
  // console.log("validateAuthen")
  const { userName, password } = req.body;
  const user = {
    userName,
    password
  };
  const SCHEMA = {
    userName: Joi.string()
      .label('userName')
      .min(6)
      .max(100)
      .required(),
    password: Joi.string()
      .label('password')
      .required()
  };

  // console.log('input: ', input);
  validate(user, SCHEMA)
    .then(() => next())
    .catch(err =>
      next(
        new ApiErrors.BaseError({
          statusCode: 400,
          type: 'loginError',
          error: err,
          name: 'Login'
        })
      )
    );
};

router.post('/', validateAuthen, async (req, res, next) => {
  try {
    console.log('authenticate body: ', req.body);
    const { userName, password, type } = req.body;

    const whereUser = {
      [Op.or]: [{ username: userName }]
      // password: md5(password)
    };

    let token;
    let dataToken;
    // let role;

    if (whereUser) {
      const userInfo = await Model.findOne(users, { where: whereUser }).catch(err => {
        ErrorHelpers.errorThrow(err, 'userNotFoundError', 'Login', 202);
      });
      if (!userInfo) {
        throw new ApiErrors.BaseError({
          statusCode: 200,
          type: 'userNotFoundError',
          name: 'Login'
        });
      }

      if (
        userInfo &&
        Number(userInfo.status) === 1 // && conditionExpire
      ) {
        console.log('whereUser.password', whereUser.password);
        const passOk = await verifyPasswordMd5(password, userInfo.password);

        if (passOk) {
          // console.log("passOk: ", passOk)
          dataToken = { user: userName, userId: userInfo.id, userGroupsId: userInfo.userGroupsId };
          token = jwt.sign(
            {
              ...dataToken
            },
            process.env.JWT_SECRET,
            {
              expiresIn: `${CONFIG.TOKEN_LOGIN_EXPIRE}`
            }
          );
          if (token) {
            res.status(200).json({
              success: true,
              status: 'ok',
              token,
              role: [],
              type,
              currentAuthority: [],
              ...dataToken
            });
          } else {
            res.status(200).json({
              success: false,
              message: 'Đăng nhập thất bại',
              status: 'error',
              token: null,
              role: {},
              type,
              currentAuthority: 'guest'
            });
          }
        } else {
          // next(new Error("Mật khẩu không đúng!"));
          throw new ApiErrors.BaseError({
            statusCode: 200,
            type: 'loginPassError',
            name: 'Login'
          });
        }
      } else {
        if (!userInfo.status) {
          throw new ApiErrors.BaseError({
            statusCode: 200,
            type: 'userInactiveError',
            name: 'Login'
          });
        }
        // else if (!conditionExpire) {
        //   throw new ApiErrors.BaseError({
        //     statusCode: 200,
        //     type: 'userExpireError',
        //     name: 'Login'
        //   });
        // }
      }
    }
  } catch (error) {
    // throw new ApiErrors.BaseError({
    //   statusCode: 200,
    //   type: 'loginError',
    //   error,
    //   name: 'Login'
    // })
    // console.log(error)
    next(error);
    // res.status(200).send(new Error(error).message)
  }
});

export default router;
