// noinspection JSUnusedGlobalSymbols

/**
 * @module dpl
 * @category command
 * @description Clipper ftp deployment utility
 * @file ftp-deploy-actions/index.js
 */

const {join} = require('path')
const {throwErr} = require('../../lib/helpers/console')
const {findPackage} = require('../../lib/helpers/fs')
const Deployment = require('./deployment.class')

const short = 'fda'
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
        'Ftp destination dir, defaults to "/"',
        '/'
    ],
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

const action = (pkgName='', cmdObj) => {
    if (!process.env.DEV_FTP_HOST || !process.env.DEV_FTP_PASSWORD || !process.env.DEV_FTP_USER) {
        console.error('FATAL ERROR: No valid credentials found in environment.')
        process.exit(1)
    }
    const [pkg, root] = findPackage(pkgName)
    const {publicDir} = pkg
    if(!publicDir) throwErr('This doesn\'t look to be a frontend package. No "publicDir" key found in package.json')
    new Deployment(join(root, publicDir), cmdObj.dest)
}

module.exports = {
    short,
    long,
    command,
    description,
    option,
    action
}