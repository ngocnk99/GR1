import multer from 'multer';
import moment from 'moment';
import path from 'path';
import fs from 'fs-extra';

/**
 *
 * @param {*} targetPath
 * @param {*} req
 * @param {*} isFile
 * @param {*} access
 */
// eslint-disable-next-line
function authPath(targetPath, req, isFile, access) {
  console.log("targetPath : %o, req.imageProject: %o, req.auth: %o, isFile: %o, access: %o", targetPath, req.imageProject, req.auth, isFile, access)

  return true;
}

/**
 * Called when the path(s) fail authorization. For example, you might want to log, and return a 403 with suitable JSON.
 *
 * @param {*} req
 * @param {*} res
 * @param {*} paths
 */
// eslint-disable-next-line
function authError(req, res, paths) {
  if (typeof paths === 'string') { paths = [paths] }
  console.error(`user ${req.user.profile.user} not authorized for path(s) %o`, paths);
  console.error(JSON.stringify(req.user, null, 2));
  res.status(403);

  return res.json({ error: 'unauthorized' });
}

// upload

const ROOT_DIR = process.cwd();
const ROOT_DIR_CONTAINER = `${ROOT_DIR}/container`;

// const authConfig = {
//   authPath,
//   authError,
// };

const CVAudioStorage = multer.diskStorage({
  // eslint-disable-next-line require-jsdoc
  destination: function (req, file, cb) {
    // console.log(req.headers)
    const authName = req.auth.user;

    // console.log(req.auth);
    const userName = authName;
    let projectName = req.headers['x-auth-project'];

    if (projectName === null || projectName === undefined || projectName === '') {
      projectName = "COMMON"
    }
    const now = moment()
    const monthDir = now.month() + 1 < 10 ? `0${now.month() + 1}` : `${now.month() + 1}`;
    const dateDir = now.date() < 10 ? `0${now.date()}` : `${now.date()}`;
    const dir = path.resolve(`${ROOT_DIR_CONTAINER}/${projectName}/userfiles/${userName}/audios/${now.year()}${monthDir}${dateDir}`)

    fs.ensureDir(dir).then(() => {
      // console.log('success!')
      cb(null, dir);
      // console.log('destination', file);
      req.body.warningFile = `/userfiles/${userName}/audios/${now.year()}${monthDir}${dateDir}`;
    })
    .catch(err => {
      console.log("upload err ", err)

      cb(err)
    })

  },
  // eslint-disable-next-line require-jsdoc
  filename: function (req, file, cb) {
    if (!file.originalname.toLowerCase().match(/\.(adp|amr|mid|midi|mp4|mp3|aac|wav|3gp|avi|mpeg|3gp|3gpp|726|3gpp|3gp|amr|amr-wb|au|snd|evc|qcp|lbc|l16|wav|mp1|mp2|mp3|m4a)$/)) {
      const err = new Error();

      err.code = 'filetype';
      console.log("upload err ", err);

      cb(err);
    } else {
      const now = moment();
      const monthDir = now.month() + 1 < 10 ? `0${now.month() + 1}` : `${now.month() + 1}`;
      const dateDir = now.date() < 10 ? `0${now.date()}` : `${now.date()}`;
      const ext = path.extname(file.originalname);
      const name = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
      const finallyDir = `${now.year()}_${monthDir}_${dateDir}_${now.hour()}_${now.minute()}_${now.second()}_${now.millisecond()}_${name}${ext}`;

      // cb(null, `${now.year()}_${monthDir}_${dateDir}_${now.hour()}_${now.minute()}_${now.second()}_${now.millisecond()}_${name}${ext}`);
      cb(null, finallyDir);

      // console.log('filename', file);
    }
  }
});

const uploadAudio = multer({ storage: CVAudioStorage, limits: { fieldNameSize: '100000', fieldSize: '50000' } });

export default {
  uploadAudio
}
