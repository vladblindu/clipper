const cli = require('commander')

/**
 * @typedef {Object} CommandData
 * @property {String} short
 * @property {String} alias
 * @property {String} long
 * @property {String} command
 * @property {String[]} description
 * @property {String[]} option
 * @property {Function} action
 */


Object.defineProperty(cli, 'addCommand', {
    writable: false,
    enumerable: false,
    /**
     * @param {CommandData} comData
     */
    value: function (comData) {
        let _cli = this['command'](comData.command)
        if (comData.alias)
            _cli = _cli['alias'](comData.alias)
        if (comData.description)
            _cli = _cli['description'](...comData.description)
        if (comData.option && comData.option.length) comData.option.forEach(
            opt => {
                _cli = _cli['option'](...opt)
            }
        )
        _cli['action'](comData.action)
    }
})

module.exports = cli