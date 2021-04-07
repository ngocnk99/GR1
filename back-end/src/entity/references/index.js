export default models => {
    // eslint-disable-next-line no-empty-pattern
    const { employer, jobker, users, roles, posts, jobkerPost, employerPost } = models;

    //roles(1) - (n)users 
    roles.hasMany(users, { foreignKey: 'roleId', as: 'users' });
    users.belongsTo(roles, { foreignKey: 'roleId', as: 'role' });

    // users(1) - (1)employer
    users.hasOne(employer, { foreignKey: 'userId', as: 'employer' });
    employer.belongsTo(users, { foreignKey: 'userId', as: 'user' });

    // users(1) - (1)jobker
    users.hasOne(jobker, { foreignKey: 'userId', as: 'jobker' });
    jobker.belongsTo(users, { foreignKey: 'userId', as: 'user' });

    // employer(1) - (n)posts   //throud: employerPost

    // users(n) - (n)posts   //throud: jobkerPost

    // users(1) - (1)employer
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