export default models => {
    // eslint-disable-next-line no-empty-pattern
    const { items, users, roles } = models;

    // users(n) - (1)roles
    roles.hasMany(users, { foreignKey: 'roleId', as: 'users' });
    users.belongsTo(roles, { foreignKey: 'roleId', as: 'role' });

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