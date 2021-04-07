import roles from './vi-Vn/roles';
import users from './vi-Vn/users';
import employer from './vi-Vn/emloyer'
import jobker from './vi-Vn/jobker'

export default {
    roles: 'Quyền',
    users: 'Người dùng',
    status: 'Trạng thái',
    createDate: 'Ngày tạo',
    FromDate: 'Ngày bắt đầu tìm kiếm',
    ToDate: 'Ngày kết thúc tìm kiếm',
    token: 'token truy cập',

    'jobker': 'thông tin người tìm việc',
    'employer': 'thông tin nhà tuyển dụng',

    'api.message.infoError': 'Lấy thông tin xác thực thất bại!',
    'api.message.infoAfterCreateError': 'Lỗi không lấy được bản ghi mới sau khi tạo thành công',
    'api.message.infoAfterEditError': 'Lấy thông tin sau khi thay đổi thất bại',
    'api.message.notExisted': 'Bản ghi này không tồn tại!',

    ...roles,
    ...users,
    ...employer,
    ...jobker,
}