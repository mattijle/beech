const KeyValue = require('keyvalue');

var instance = new KeyValue({
    indent: 4,
    atomic: true
})
instance.load('./data/data.yaml');

const save = () => {
    return instance.save('./data/data.yaml', {
        format: 'yaml',
        indent: 4,
        atomic: true
    });
}
exports.save = save;
exports.setGuildRoles = (guild, roles) => {
    instance.set(guild, 'roles', roles)
    save();
    return;
}
exports.getGuildRoles = (guild) => {
    return instance.get(guild, 'roles');
}
exports.getGuildInfoChannel = (guild) => {
    return instance.get(guild, 'channel');
}
exports.getGuildRoleMessage = (guild) => {
    return instance.get(guild, 'RoleMessage');
}
exports.setGuildRoleMessage = (guild, messageId) => {
    instance.set(guild, 'RoleMessage', messageId);
    return save();
}
exports.setGuildInfoChannel = (guild, channelId) => {
    instance.set(guild, 'channel', channelId);
    return save();
}