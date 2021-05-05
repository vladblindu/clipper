// noinspection JSUnusedGlobalSymbols

/**
 * @module dpl
 * @category command
 * @description Clipper ftp deployment utility
 * @file ftp-deploy-actions/index.js
 */

const {join, basename} = require('path')
const {existsSync} = require('fs')
const inquirer = require('inquirer')
const {throwErr, interactiveFail} = require('../../lib/helpers/console')
const {findPackage} = require('../../lib/helpers/fs')
const Deployment = require('./deployment.class')
const {WS_MAP_KEY, PUBLIC_ROOT_KEY} = require('../../lib/constants')
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

const action = async (pkgName = '', cmdObj) => {
    if (
        !config.env('DEV_FTP_HOST') ||
        !config.env('DEV_FTP_PASSWORD') ||
        !config.env('DEV_FTP_USER')
    ) {
        throwErr('No valid credentials found in environment.')
    }
    let [pkg, root, wsPkg, wsRoot] = findPackage(pkgName)

    let isRoot = false
    let pkgDir

    if(!wsPkg) {
        wsPkg = pkg
        wsRoot = root
        isRoot = true
    }


    if(!wsPkg[WS_MAP_KEY])
        throwErr('No workspace map found (wsMap key in workspaces base package.json). Please use the -r flag to register the packages')

    const publicDir = config.path(PUBLIC_ROOT_KEY)

    if(isRoot){
        const packages = Object.keys(pkg[WS_MAP_KEY])
        const front = packages.filter(
            pk => existsSync(join(wsRoot, publicDir, pk))
        )
        if(!front.length)
            throwErr('No viable frontend deployable package found in this workspace. Check your "wsMap" registration status.')
        if(front.length === 1) pkgDir = front[0]
        else {
            let queryData = null
            try {
                queryData = await inquirer.prompt([
                    {
                        type: 'list',
                        name: 'package',
                        message: `Select a frontend package to be deployed:`,
                        choices: front,
                        default: front[0]
                    }
                ])
            } catch (err) {
                interactiveFail(err)
            }
            pkgDir = wsPkg[WS_MAP_KEY][queryData]
        }
    } else {
        pkgDir = basename(root)
        if (!existsSync(join(wsRoot, publicDir, pkgDir)))
            throwErr('This doesn\'t look to be a frontend package. No public root found.')
    }
    log('Deploying to dev live server:')
    new Deployment(join(wsRoot, publicDir, pkgDir), cmdObj.dest || wsPkg['name'])
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