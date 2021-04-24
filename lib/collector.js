const glob = require('glob')
const {COMMAND_GLOB, COMMAND_DIR} = require('../config')

/**
 * @returns {Command}
 */

module.exports = {
    collector: () => glob
        .sync(COMMAND_GLOB , {cwd: COMMAND_DIR, absolute: true})
        .map(pth => require(pth))
}