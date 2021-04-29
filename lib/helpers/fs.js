const {basename, extname, join, resolve, sep} = require('path')
const {
    existsSync,
    mkdirSync,
    readdirSync,
    readFileSync,
    rmdirSync,
    symlinkSync,
    unlinkSync,
    writeFileSync
} = require('fs')
const glob = require('glob')
const {isEmpty} = require('./obj')
const {inline, logOK, throwErr, warn} = require('./console')
const {DEVERR, PKG, ENV, WORKSPACE, JSON_EXT, WS_MAP_KEY, WS_IGNORE_KEY} = require('../constants')


/**
 * @name readJson
 * @description safely reads a json file
 * @param {String} pth
 * @param {String?} target
 * @return {Object}
 */
const readJson = (pth, target = 'target') => {
    if (!existsSync(pth))
        throwErr(`Couldn't locate the ${target} file in ${pth}.`)
    let raw = ''
    try {
        raw = readFileSync(pth, 'utf8')
    } catch (err) {
        throwErr(`Couldn't read the ${target} file in ${pth}.Reason: ${err.message}`, DEVERR)
    }
    try {
        return JSON.parse(raw)
    } catch (err) {
        throwErr(`Invalid JSON format in the ${target} file located in ${pth}.`, DEVERR)
    }
}

/**
 * @name writeJson
 * @description safely writes a json file
 * @param {String} pth
 * @param {Object} data
 * @param {String?} target
 */
const writeJson = (pth, data, target = 'target') => {
    let raw = ''
    try {
        raw = JSON.stringify(data, null, 2)
    } catch (err) {
        throwErr(`Unable to stringify ${target} to JSON. Reason: ${err.message}`, DEVERR)
    }
    if (!pth.endsWith(JSON_EXT)) pth += JSON_EXT
    try {
        writeFileSync(pth, raw)
    } catch (err) {
        throwErr(`Unable to write ${target} file in ${pth}. Reason: ${err.message}`, DEVERR)
    }
}

/**
 * @param {string} src
 * @param {string} dest
 * @returns <void>
 */
const createLink = (src, dest) => {
    const type = extname(basename(src)) ? 'file' : 'dir'
    try {
        if (existsSync(dest)) {
            inline(`Removing old ${dest}...`)
            unlinkSync(dest)
            logOK()
        }
        inline(`Linking ${src} to ${dest}...`)
        symlinkSync(src, dest, type)
        logOK()
    } catch (err) {
        throwErr(err.message)
    }
}

/**
 * @name createDir
 * @description interactively creates a directory
 * @param {string} dir
 * @param {string} root
 * @param {boolean} force
 * @return <void>
 */
const createDir = (dir, root, force) => {
    const parts = dir.indexOf(sep) !== -1
        ? dir.split(sep)
        : [dir]
    parts.reduce((acc, part) => {
        part = join(root, acc, part)
        if (existsSync(part)) {
            if (readdirSync(part).length) {
                if (!force)
                    throwErr(`${part} directory already exists and is not empty. Please use the force flac`)
                else rmdirSync(part, {recursive: true})
            } else {
                warn(`${part} directory already exists. Skipping creation.`)
                return part
            }
        }
        inline(`Creating ${part} dir...`)
        mkdirSync(acc)
        logOK()
        return part
    }, '')
}

/**
 * @name getPackage
 * @description gets a single package.json
 * @param {String?} root
 * @return {object}
 */
const getPackage = root => {
    if (basename(root) !== PKG) root = join(root, PKG)
    try {
        return JSON.parse(readFileSync(root, 'utf8'))
    } catch (err) {
        throwErr(`Couldn't read/find any valid ${PKG} in ${root}. Reason: ${err.message}`)
    }
}

/**
 * @name putPackages
 * @description writes a package.json file
 * @param {Object} pkg
 * @param {String} root
 */
const putPackage = (pkg, root) => {
    if (basename(root) !== PKG) root = join(root, PKG)
    try {
        writeFileSync(root, JSON.stringify(pkg, null, 2))
    } catch (err) {
        throwErr(`Couldn't save ${PKG} in ${root}. reason: ${err.message}`)
    }
}

/**
 * @description find a package json uproot, if ws find the root monorepo package
 * @returns {[Object, string]}
 */
const findRoot = () => {
    let root = process.cwd()
    while (root !== '/') {
        const pkgPth = join(root, PKG)
        if (existsSync(pkgPth)) {
            const wsPkg = getPackage(pkgPth)
            if (wsPkg[WORKSPACE]) return [wsPkg, root]
        }
        root = resolve(root, '../')
    }
    throwErr('It seems your "cwd" is not contained in a monorepo workspace.')
}

/**
 * @param {string?} pkgName
 * @returns {[object, string, object, string]}
 */
const findPackage = pkgName => {
    let root = process.cwd()
    let [wsPkg, wsRoot] = findRoot()
    if (!pkgName) while ((root !== '/') || !(root.endsWith(':/'))) {
        const pkgPth = join(root, PKG)
        if (existsSync(pkgPth)) {
            if (!Object.values(wsPkg[WS_MAP_KEY]).some(pk => pk === root))
                throwErr(`The ${basename(root)} isn't registered in the ` +
                    'wsMap key of your workspace root package.json file. Please check "cwd".')
            return [getPackage(pkgPth), root, wsPkg, wsRoot]
        }
        root = resolve(root, '../')
    }
    else {
        root = wsPkg[WS_MAP_KEY][pkgName]
        if (!root)
            throwErr(`No registered ${pkgName} found in workspace root ${PKG} under the ${WS_MAP_KEY} key.`)
        return [getPackage(root), root, wsPkg, wsRoot]
    }
}


/**
 * @returns {string}
 */
const find = res => {
    let root = process.cwd()
    while ((root !== '/') || !(root.endsWith(':/'))) {
        const resPth = join(root, res)
        if (existsSync(resPth)) return resPth
        root = resolve(root, '../')
    }
    throwErr(`No ${res} file found.`)
}
/**
 * @returns {string}
 */
const findEnv = () => find(ENV)

/**
 * @description creates a map package name: package absolute [ath for mono-repos
 * @param {Object} pkg
 * @param {String} root
 */
const mapPackages = (pkg, root) => pkg[WORKSPACE].reduce((acc, ws) => {
    if (ws[ws.length - 1] === '*')
        glob.sync('*/', {
            cwd: join(root, ws.slice(0, -1)),
            absolute: true
        })
            .forEach(d => {
                const pth = join(d, PKG)
                if (existsSync(pth)) {
                    const _pkg = readJson(pth)
                    if(!_pkg[WS_IGNORE_KEY]) acc[d.split(sep).pop()] = d
                }
            })
    return acc
}, {})

/**
 * @param {string} key
 * @param {object} obj
 * @param {string?} pth
 * @returns {string}
 */
const pathFromObj = (key, obj, pth) => {

    if(!key)
        throwErr('No key specified.')

    if(isEmpty(obj))
        throwErr('Path object source is invalid. (Empty object)')

    if(!pth){
        if(!obj.root)
            throwErr('Path object source is invalid. (No root key)')
        pth = obj.root
    }

    for (let k of Object.keys(obj)) {
        if (k === key) return join(pth, key)
        if (typeof obj[k] === 'object')
            return pathFromObj(key, obj[k], join(pth, k))
    }

    return ''
}

/**
 * @description add a key to the monorepo root package json containing all the
 * packages and their respective absolute paths
 */
const registerWsMap = () => {
    const [pkg, root] = findRoot()
    pkg.wsMap = mapPackages(pkg, root)
    putPackage(pkg, root)
}
module.exports = {
    readJson,
    writeJson,
    createLink,
    createDir,
    getPackage,
    putPackage,
    findRoot,
    findPackage,
    findEnv,
    mapPackages,
    pathFromObj,
    registerWsMap
}
