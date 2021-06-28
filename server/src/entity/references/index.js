export default models => {
  // eslint-disable-next-line no-empty-pattern
  const { users, userGroups } = models;

  // NHÓM NGƯỜI DÙNG
  // userGroups.belongsTo(users, {
  //   foreignKey: 'userCreatorsId',
  //   as: 'userCreators'
  // });
  // Người dùng (users)
  users.belongsTo(userGroups, {
    foreignKey: 'userGroupsId',
    as: 'userGroups'
  });

  //Vùng - Thành phố (regions - provinces)
  // provinces.belongsTo(regions, {
  //   foreignKey: 'regionsId',
  //   as: 'regions'
  // });
  // regions.hasMany(provinces, {
  //   foreignKey: 'regionsId',
  //   as: 'provinces'
  // });
};
