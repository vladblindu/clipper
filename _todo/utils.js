const path = require('path')
const fs = require('fs')
const glob = require('glob')
const inquirer = require('inquirer')
const {STAKI} = require('../lib/constants')
const {warn} = require('./helpers')
const {log, inline, throwErr, mkDir, logOK} = require('./helpers')
const {interactiveFail} = require('./helpers')
const {NONE, GREEN, PKG, PACKAGES_ROOT} = require('../lib/constants')

/**
 * @typedef {Object} Package
 * @property {String} path
 * @property {Object} data
 */

/**
 * @name getPackage
 * @description gets a single package.json
 * @param {String?} root
 * @return {Package}
 */
const getPackage = (root = process.cwd()) => {
    const rootPkg = path.join(root, PKG)
    try {
        return {
            path: root,
            data: JSON.parse(
                fs.readFileSync(rootPkg, 'utf8')
            )
        }
    } catch (err) {
        throwErr(`Couldn't read/find any valid ${PKG} in ${rootPkg}. Reason: ${err.message}`)
    }
}

/**
 * @name getPackages
 * @description gets multiple package.json`s
 * @param {String | Object?} root
 * @param {Object?} opts
 * @return {Package[]}
 */
const getPackages = (root = process.cwd(), opts = {}) => {

    if (typeof root !== 'string') {
        root = process.cwd()
        opts = root
    }
    const verbose = opts && opts.verbose

    log('Retrieving package data...', NONE, verbose)

    const rootPkg = getPackage(root)

    let pkgRoots = ''

    if (rootPkg.data[PACKAGES_ROOT] && rootPkg.data[PACKAGES_ROOT].length)
        pkgRoots = rootPkg.data[PACKAGES_ROOT]
    else return [rootPkg]

    return pkgRoots.reduce(
        (acc, pkr) => {
            const pth = path.join(root, pkr)
            const packagesPath = glob.sync(`${pth}/**/${PKG}`, {absolute: true, dir: true})

            inline(`Processing ${pkr}...`, NONE, verbose)
            acc.push(...packagesPath.map(pth => getPackage(path.dirname(pth))))
            log('OK', GREEN, verbose)
            return acc
        }, [rootPkg])
}

/**
 * @name putPackages
 * @description writes a package.json file
 * @param {Package} pkg
 */
const putPackage = pkg => {
    try {
        fs.writeFileSync(path.join(pkg.path, PKG), JSON.stringify(pkg.data, null, 2))
    } catch (err) {
        throwErr(`Couldn't save staki config in ${pkg.path}/${PKG}. reason: ${err.message}`)
    }
}

/**
 * @name confirm
 * @description performs an interactive (inquirer) confirmation dialog
 * @param {String} message
 * @returns {Promise<*>}
 */
const confirm = async message => {

    const query = {
        type: 'confirm',
        name: 'ok',
        default: true
    }
    query.message = message
    try {
        const {ok} = await inquirer.prompt(query)
        return ok
    } catch (err) {
        interactiveFail(err)
    }
}

/**
 * @name setupDir
 * @description interactively creates a directory
 * @param {String} root
 * @param {String?} target
 * @return {Promise<Boolean>}
 */
const setupDir = async (root, target = 'source') => {
    const parts = root.indexOf(path.sep) !== -1
        ? root.split(path.sep)
        : [root]
    if (!path.isAbsolute(parts[0])) parts[0] = path.join(process.cwd(), parts[0])
    if (!fs.existsSync(parts[0])) {
        warn(`"${root}" doesn't look like a valid ${target} directory.`)
        const ok = await confirm(`Would you like staki to create the ${root} for you?`)
        if (!ok) {
            warn(`You should manually setup the ${target} dir in your ${STAKI} section of the ${PKG}`)
            return false
        }
        parts.reduce((acc, part) => {
            acc = path.join(acc, part)
            mkDir(acc)
            inline(`${root} created...`)
            logOK()

            return acc
        }, '')
    }
}

module.exports = {

    getPackage,

    getPackages,

    putPackage,

    confirm,

    setupDir
}