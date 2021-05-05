const {relative} = require('path')
const {readFileSync, writeFileSync} = require('fs')
const {collectFsa, dirList, linkList} = require('./helpers')
const {createDir, createLink, findPackage, findRoot, putPackage} = require('../../lib/helpers/fs')
const {warn, inline, log, logOK, throwErr} = require('../../lib/helpers/console')
const {basename, dirname, join} = require('path')
const {BLUE, PKG, WS_MAP_KEY} = require('../../lib/constants')
const {blue} = require('chalk')
const {GITIGNORE, GITIGNORE_PKG_COMMENT} = require('./constants')

const iterateFsa = (fsa, linkAct, dirAct) => Object.keys(fsa).forEach(
    k => {
        if (k !== 'dirs')
            linkAct(fsa[k], k)
        else
            dirList(dirAct(fsa[k]))
    }
)


const execPkg = (pkgName, force) => {
    const {fsa, root, wsRoot} = collectFsa(pkgName)
    inline(`Initialising fsa for ${blue(pkgName)} package...`)
    iterateFsa(
        fsa,
        (src, dest) => {
            createLink(join(wsRoot, src), join(root, dest))
        },
        d => {
            createDir(d, root, force)
        }
    )
    logOK()
}

/**
 * @param {string} pkgName
 * @param {boolean} force
 */
const execAll = (pkgName, force) => {
    if (pkgName) execPkg(pkgName, force)
    const [wsPkg, wsRoot] = findRoot()
    inline(`Initialising fsa for ${blue('workspace root package')}...`)
    if(wsPkg['fsa']) iterateFsa(
        wsPkg['fsa'],
        (src, dest) => {
            createLink(join(wsRoot, src), join(wsRoot, dest))
        },
        d => {
            createDir(d, wsRoot, force)
        }
    )
    logOK()
    Object.keys(wsPkg[WS_MAP_KEY]).forEach(pkgName => {
        execPkg(pkgName, force)
    })

}

const registerLink = (src, dest, pkgName) => {
    const [pkg, root, , wsRoot] = findPackage(pkgName)
    if (!pkg['fsa'])
        throwErr(`No fsa key found in the ${join(root, PKG)} file.`)
    createLink(join(wsRoot, src), join(root, dest))
    pkg['fsa'][src] = dest
    putPackage(pkg, root)
}


const registerExternal = registerLink

const registerDir = (dir, pkgName, force) => {
    const [pkg, root] = findPackage(pkgName)
    if (!pkg['fsa'])
        throwErr(`No fsa key found in the ${join(root, PKG)} file.`)
    createDir(dir, root, force)
    pkg['fsa'].dirs.push(dir)
    putPackage(pkg, root)
}

const list = pkgName => {
    const [pkg, root] = findPackage(pkgName)
    if (!pkg['fsa'])
        throwErr(`No fsa key found in the ${join(root, PKG)} file.`)
    inline(`Package file system actions list: `)
    log(`${pkg['name']}(${basename(dirname(root))})`, BLUE)
    iterateFsa(pkg['fsa'], linkList, dirList)
}


export const addToGitIgnore = pkgName => {
    const [pkg, root, , wsRoot] = findPackage(pkgName)
    const ignorePath = join(wsRoot, GITIGNORE)

    if(!pkg.links || !Object.keys(pkg.links).length) {
        warn(`No links found in ${pkg.name}. If there should be any, please register them before running this command.`)
        return []
    }
    const ignored = Object.values(pkg.links).map(
        /**
         * @param {string}dest
         * @returns {string}
         */
        dest => relative(wsRoot, join(root, dest))
    ).join('\n').concat('\n')
    const tmp = readFileSync(ignorePath, 'utf8')

    const splitPoint = GITIGNORE_PKG_COMMENT.concat(pkg.name, '\n')
    const [safe, pkgIgnore]= tmp.split(splitPoint)
    let rest = ''
    if(pkgIgnore.length) {
        [, rest] = pkgIgnore.split('#')
        if(rest) rest = '#'.concat(rest)
    }
    const newIgnore = safe.concat(splitPoint, ignored, rest)
    writeFileSync(ignorePath, newIgnore)
}

module.exports = {
    execPkg,
    execAll,
    registerLink,
    registerExternal,
    registerDir,
    list,
    addToGitIgnore
}