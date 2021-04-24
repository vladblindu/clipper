const {join} = require('path')
const {findPackage} = require('../../lib/helpers/fs')
const {inline, log, throwErr} = require('../../lib/helpers/console')
const {BLUE, PKG} = require('../../lib/constants')

/**
 * @typedef {{packagePath:string}} Links
 */

/**
 * @typedef {Object} Fsa
 * @property {string[]} dirs
 * @property {Links} links
 * @property {Object} externals
 */

/**
 * @param {string} pkgName
 * @returns {{wsRoot:string, root: string, root: string}}
 */
const collectFsa = pkgName => {
    const [pkg, root, , wsRoot] = findPackage(pkgName)
    const {fsa} = pkg
    if (!fsa)
        throwErr(`No fsa key found in the ${join(root, PKG)} file.`)
    return {fsa, root, wsRoot}
}

/**
 * @param {object} links
 * @param {string} type
 * returns <void>
 */
const linkList = (links,type) => {
    log(`Package ${type} links list: `)
    Object.keys(links).forEach(
        (src) => {
            inline('- link ')
            inline(src, BLUE)
            inline(' => ')
            log(links[src], BLUE)
        })
}

/**
 * @param {string[]} dirs
 * returns <void>
 */
const dirList = dirs => {
    log('Package dirs list: ')
    dirs.forEach(
        d => {
            inline('- dir ')
            log(d, BLUE)
        })
}
module.exports = {
    collectFsa,
    linkList,
    dirList
}
