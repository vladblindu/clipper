// noinspection JSUnusedGlobalSymbols

/**
 * @module dpl
 * @category command
 * @description Clipper ftp deployment utility
 * @file ftp-deploy-actions/index.js
 */

const {join, dirname, basename} = require('path')
const {existsSync} = require('fs')
const {throwErr} = require('../../lib/helpers/console')
const {findPackage} = require('../../lib/helpers/fs')
const Deployment = require('./deployment.class')
const {WS_MAP_KEY, PUBLIC_DIR_KEY} = require('../../lib/constants')
const {log} = require('../../lib/helpers/console')

const short = 'fda'
const alias = 'deploy'
const long = 'ftpDeploymentAction'
const command = 'fda [pkg]'
const description = [
    'Ftp deployment utility',
    {
        pkgName: 'Target package. if omitted, current cwd package is assumed'
    }]
const option = [
    [
        '-d, --dest <type>',
        'Ftp destination dir, defaults to "/"'
    ]
]

/**
 * @typedef {object} FdaCmdObj
 * @property {string} dest
 */

/**
 * @name action
 * @description project initialisation command utility
 * @param {string} pkgName
 * @param {FdaCmdObj} cmdObj
 * @returns {void}
 * @return <void>
 */

const action = (pkgName = '', cmdObj) => {
    if (
        !config.env('DEV_FTP_HOST') ||
        !config.env('DEV_FTP_PASSWORD') ||
        !config.env('DEV_FTP_USER')
    ) {
        throwErr('No valid credentials found in environment.')
    }
    const [, root, wsPkg] = findPackage(pkgName)
    if(!wsPkg[WS_MAP_KEY])
        throwErr('No workspace map found (wsMap key in workspaces base package.json). Please use the -r flag to register the packages')
    const pkgDir = basename(dirname(root))
    const publicDir = config.path(PUBLIC_DIR_KEY)
    if (!existsSync(join(publicDir, pkgDir)))
        throwErr('This doesn\'t look to be a frontend package. No public root found.')
    log('Deploying to dev live server:')
    new Deployment(publicDir, cmdObj.dest || wsPkg['name'])
}

module.exports = {
    short,
    alias,
    long,
    command,
    description,
    option,
    action
}