const KeyValue = require('keyvalue');

var instance = new KeyValue({
    indent: 4,
    atomic: true
})
instance.load('./data/data.yaml');

const save = () => {
    instance.save('./data/data.yaml', {
        format: 'yaml',
        indent: 4,
        atomic: true
    });
}
exports.save = save;
exports.updateGuildRoles = (guild, roles) => {
    instance.set(guild, 'roles', roles)
    save();
}
exports.getGuildRoles = (guild) => {
    return instance.get(guild, 'roles');
}