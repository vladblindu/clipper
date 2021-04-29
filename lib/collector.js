const {resolve, join} = require('path')
const {existsSync} = require('fs')
const glob = require('glob')
const {COMMAND_GLOB_KEY, COMMAND_DIR_KEY} = require('./constants')

/**
 * @returns {Command}
 */
const collector = () => glob.sync(
    config[COMMAND_GLOB_KEY], {
        cwd: resolve(__dirname, '../', config[COMMAND_DIR_KEY]),
        absolute: true
    })
    .filter(pth => existsSync(join(pth)))
    .map(pth => require(pth))

module.exports = collector()