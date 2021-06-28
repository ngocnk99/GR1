import user from './vi-Vn/user';
import userGroups from './vi-Vn/userGroups';
import provinces from './vi-Vn/provinces';
import regions from './vi-Vn/regions';
export default {
  token: 'Mã bảo mật',
  createDate: 'Ngày tạo',

  ...user,
  ...userGroups,

  ...provinces,
  ...regions
};
