/* eslint-disable no-useless-escape */

export const regUrl = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/i;

export const regUri = /(\/|\w+:)(\/?\/?)[^\s]+/i;

export const regName = /^([a-zA-Z0-9][\-a-zA-Z0-9]*\.)+[\-a-zA-Z0-9]{2,20}$/i;

export const regPath = /^([A-Za-z]:|[A-Za-z0-9_-]+(\.[A-Za-z0-9_-]+)*)((\/[A-Za-z0-9_.-] +)+)$/i;

export const regAccessControlName = /^[a-zA-Z0-9]{1,100}$/i;

export const regHeaderName = /^[a-zA-Z0-9-_]{1,100}$/i;
export const regHeaderValue = /(@)(?:.*?\1)/i;

export const regDomain = /^([a-zA-Z0-9][\-a-zA-Z0-9]*\.)+[\-a-zA-Z0-9]{2,20}$/i;

/**
 * Test partent.
 *
 * @param {RegEx} regEx
 * @param {String} value
 */
export const regTest = (regEx, value) => {
  return regEx.test(value);
}

/**
 * Test not undefined.
 *
 * @param {String} value
 */
export const isNotUndefined = value => {
  return typeof value === 'undefined'
}

/**
 *
 * @param {*} str
 */
export const fnCachedKey = (str) => {
  let str1 = str;

  str1 = str1.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  str1 = str1.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  str1 = str1.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  str1 = str1.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  str1 = str1.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  str1 = str1.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  str1 = str1.replace(/đ/g, "d");
  str1 = str1.replace(/\:|,/g, "_");
  str1 = str1.replace(/!|@|\$|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\'| |\"|\&|\#|\[|\]|\{|\}|~/g, "");
  // str = str.replace(/-+-/g, " ");
  // str = str.replace(/^\-+|\-+$/g, "");
  str1 = str1.replace(/_$/g, '');

  return str1;
}
