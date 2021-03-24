export default {
  // global
  configFileError: { code: 1491, messages: ['Kiểm tra cấu hình site ở file xảy ra lỗi', 'Verify file config fail.'] },
  syncFileError: { code: 1492, messages: ['Đồng bộ file của site xảy ra lỗi', 'Sync file config fail.'] },
  transactionError: { code: 1490, messages: ['Giao dịch bị hủy bỏ', 'Transaction rollback.'] },
  getListSuccess: { code: 1400, messages: ['Get list successful.'] },
  getListError: { code: 1401, messages: ['Lỗi lấy danh sách', 'Get list fail.'] },

  getInfoAttributes: { code: 1407, messages: ['Thuộc tính phải là một mảng', 'Attributes must be array of fields.'] },
  getInfoError: { code: 1415, messages: ['Lỗi lấy thông tin', 'Get info error.'] },

  getInfoNoPermision: { code: 1416, messages: ['Bạn không có quyền đối với nội dung này', 'You not have permision to access this resource.'] },
  permisionInfoError: { code: 1416, messages: ['Quá trình kiểm tra quyền truy cập dữ liệu bị lỗi', 'Error when check permision.'] },

  crudSuccess: { code: 1402, messages: ['Tạo hoặc sửa thành công. Nhưng có lỗi xả ra.', 'Create or modified successful. But something error on server.'] },
  crudError: { code: 1403, messages: ['Tạo hoặc sửa xảy ra lỗi', 'Create or modified fail.'] },
  crudInfo: { code: 1404, messages: ['Lỗi lấy thông tin sau khi tạo hoặc sửa', 'Get info error.'] },
  crudExisted: { code: 1405, messages: ['Bản ghi đã tồn tại', 'Record is existed.'] },
  paramError: { code: 1406, messages: ['Định dạng gửi đi không đúng', 'Format request is invalid.'] },
  bodyError: { code: 1407, messages: ['Định dạng gửi đi không đúng', 'Format request body is invalid.'] },
  crudNoProcess: { code: 1409, messages: ['Không có thay đổi so với bản ghi trước đó.', 'Changed value is the same previous. Nothing updated.'] },
  crudNotExisted: { code: 1410, messages: ['Bản ghi không tồn tại', 'Record is not existed.'] },
  crudSiteNotExisted: { code: 1411, messages: ['Site này không tồn tại', 'Site is not existed.'] },
  deleteSuccess: { code: 1412, messages: ['Xóa thành công, nhưng có lỗi xảy ra.', 'Delete successful. But something error on server.'] },
  deleteError: { code: 1413, messages: ['Lỗi khi xóa', 'Delete fail.'] },
  deleteId: { code: 1414, messages: ['Trường [id] bị thiếu hoặc sai định dạng', 'Invalid or missing [id].'] },

  sslError: { code: 1416, messages: ['Key và giá trị Certificate không khớp', 'Verify key and certificate ssl false.'] },
  sqlError: { code: 1417, messages: ['Lỗi truy vấn SQL', 'SQL query error.'] },
  typeSQLError: { code: 1418, messages: ['Kiểu truy vấn SQL sai', 'Type of SQL query error.'] },

  // create site
  loginPassError: { code: 1001, messages: ['Tài khoản hoặc mật khẩu không đúng', 'Mật khẩu không đúng', 'Invalid or missing [siteName].'] },
  userNotFoundError: { code: 1002, messages: ['Tài khoản hoặc mật khẩu không đúng', 'Tài khoản không tồn tại', 'Invalid or missing [uri].'] },
  userInactiveError: { code: 1003, messages: ['Tài khoản hoặc mật khẩu không đúng', 'Tài khoản bị vô hiệu hóa', 'Invalid or missing [uri].'] },
  loginError: { code: 1004, messages: ['Đăng nhập thất bại', 'Invalid or missing [siteName].'] },
  loginExprite: { code: 1004, messages: ['Tài khoản của bạn đã hết hạn!', 'Your account is exprited!.'] },

  // connect care
  connectError: { code: 1201, messages: ['Kết nối dược quốc gia thất bại', 'Connect failed!'] },
  connectFireBaseError: { code: 1202, messages: ['Kết nối Firebase thất bại', 'Connect failed!'] },
  sendNotificationError: { code: 1203, messages: ['Gửi cảnh báo thất bại!', 'Send Notification to firebase Error!'] },

}
