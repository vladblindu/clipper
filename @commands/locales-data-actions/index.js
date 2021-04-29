// noinspection JSUnusedGlobalSymbols

/**
 * @module locales
 * @category command
 * @description Clipper ftp deployment utility
 * @file ftp-deploy-actions/index.js
 */

const {log} = require('../../lib/helpers/console')
const {init} = require('./actions')

const short = 'loc'
const alias = 'locales-data-actions'
const long = 'setup-locales-data-actions-files'
const command = 'loc'
const description = [
    'Generate locales-data-actions files']
const option = [
    [
        '-d, --delete <type>',
        'delete locales-data-actions entry'
    ],
    [
        '-a, --add <type>',
        'add locales-data-actions entry. Format: lang-code(2 chars):lang-name:flag-file. (ex: en:english:united-kingdom[.png])'
    ],
    [
        '-f, --flag <type>',
        'modify flag file. Format lang-code|lang-name:new-flag-file-name[.png]'
    ],
    [
        '-c, --code <type>',
        'modify lang code. Format old-lang-code|new-lang-code'
    ],
    [
        '-n, --lang <type>',
        'modify lang name. Format old-lang-name|new-lang-name'
    ],
    [
        '-l, --list <type>',
        'list all installed locales-data-actions'
    ]
]

/**
 * @typedef {object} LocCmdObj
 * @property {string} add
 * @property {string} delete
 * @property {string} flag
 * @property {string} code
 * @property {string} lang
 */

/**
 * @name action
 * @description project initialisation command utility
 * @param {LocCmdObj} cmdObj
 * @return <void>
 */

const action = cmdObj => {

    if (cmdObj.add) {
        return log('TODO: to be implemented')
    }
    if (cmdObj.delete) {
        return log('TODO: to be implemented')
    }
    if (cmdObj.flag) {
        return log('TODO: to be implemented')
    }
    return init()
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