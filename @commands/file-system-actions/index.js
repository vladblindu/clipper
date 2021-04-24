// noinspection JSUnusedGlobalSymbols

/**
 * @module fsa
 * @category command
 * @description Clipper file system actions
 * @file file-system-actions/index.js
 */

const {execAll, execPkg, list, registerDir, registerExternal, registerLink} = require('./actions')
const {throwErr} = require('../../lib/helpers/console')

const short = 'fsa'
const long = 'fileSystemActions'
const command = 'file-system-actions [pkg]'
const description = [
    'File system specific actions command. (dir and symlink creation directory and more...)',
    {
        src: 'If required provide a source directory for the current action',
        dest: 'If required provide a destination directory for the current action',
        pkg: 'Target package. if omitted, current cwd package is assumed'
    }]
const option = [
    [
        '-s, --symlink <source/path:dest/path>',
        'Register new link in the file-system-actions key of the specified. Specify [source-path]:[destination-path] '
    ],
    [
        '-l, --list',
        'The content of the file-system-actions configuration object'
    ],
    [
        '-d, --dir',
        'Register new directory in the file-system-actions key of the specified. Specify [dir]. Recursive allowed.'
    ],
    [
        '-e, --external',
        'Add external symlink (relative to workspace root directory)'
    ],
    [
        '-f, --force',
        'Force operation.'
    ]
]

/**
 * @typedef {object} FsaCmdObj
 * @property {boolean} symlink
 * @property {boolean} list
 * @property {boolean} dir
 * @property {boolean} external
 * @property {boolean} force
 */

/**
 * @name action
 * @description project initialisation command utility
 * @param {string} pkgName
 * @param {FsaCmdObj} cmdObj
 * @returns {void}
 * @return <void>
 */

const action = (pkgName='', cmdObj) => {
    const force = !!cmdObj.force
    if (cmdObj.symlink) {
        if(cmdObj.symlink.indexOf(':') === -1)
            throwErr('Symlink registration format is: -s source/path:dest/path,' +
                ' where source/path is relative to the workspace root and dest/path ' +
                'is relative to the specified/current package root')
        return registerLink(...cmdObj.symlink.split(':'), pkgName)
    }
    
    if (cmdObj.list) return list(pkgName)
    if (cmdObj.dir) return registerDir(cmdObj.dir, force, pkgName)
    if (cmdObj.external) {
        if(cmdObj.external.indexOf(':') === -1)
            throwErr('external symlink registration format is: -e source/path:dest/path,' +
                ' where source/path is relative to the workspace root and dest/path ' +
                'is relative to the specified/current package root')
        return registerExternal(...cmdObj.external.split(':'), pkgName)
    }
    if(pkgName) return execPkg(pkgName, force)
    execAll(pkgName, force)
}
module.exports = {
    short,
    long,
    command,
    description,
    option,
    action
}