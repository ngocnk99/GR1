export default models => {
    // eslint-disable-next-line no-empty-pattern
    const { employerProfile, jobkerProfile, users, roles } = models;

    //roles(1) - (n)users 
    roles.hasMany(users, { foreignKey: 'roleId', as: 'users' });
    users.belongsTo(roles, { foreignKey: 'roleId', as: 'role' });

    // users(1) - (1)employerProfile
    users.hasOne(employerProfile, { foreignKey: 'userId', as: 'employerProfile' });
    employerProfile.belongsTo(users, { foreignKey: 'userId', as: 'user' });

    // users(1) - (1)employerProfile
    users.hasOne(jobkerProfile, { foreignKey: 'userId', as: 'jobkerProfile' });
    jobkerProfile.belongsTo(users, { foreignKey: 'userId', as: 'user' });


    // room
    // rooms.belongsToMany(items, { foreignKey: 'roomId', as: 'items', through: 'roomItem' });
    // rooms.hasMany(roomItem, { foreignKey: 'roomId' });

    // roomItem
    // roomItem.belongsTo(rooms, { foreignKey: 'roomId', as: 'room' });
    // roomItem.belongsTo(items, { foreignKey: 'itemId', as: 'item' });

    // items
    // items.belongsToMany(rooms, { foreignKey: 'itemId', as: 'rooms', through: 'roomItem' });
    // items.hasMany(roomItem, { foreignKey: 'itemId' });
}