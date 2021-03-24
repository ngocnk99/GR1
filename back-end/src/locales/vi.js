import items from './vi-Vn/roles';
import roles from './vi-Vn/items';
import users from './vi-Vn/users';


export default {
    roles: 'Quyền',
    users: 'Người dùng',
    status: 'Trạng thái',
    createDate: 'Ngày tạo',
    FromDate: 'Ngày bắt đầu tìm kiếm',
    ToDate: 'Ngày kết thúc tìm kiếm',

    'api.message.infoError': 'Lấy thông tin xác thực thất bại!',
    'api.message.infoAfterCreateError': 'Lỗi không lấy được bản ghi mới sau khi tạo thành công',
    'api.message.infoAfterEditError': 'Lấy thông tin sau khi thay đổi thất bại',
    'api.message.notExisted': 'Bản ghi này không tồn tại!',

    ...items,
    ...roles,
    ...users,
}