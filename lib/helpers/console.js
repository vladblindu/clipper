const chalk = require('chalk')
const {DEVERR, GREEN, RUNERR} = require('../constants')

const {magenta, red, yellow} = chalk

/**
 * @name noMsg
 * @description throws an error if an exception without message is raised
 */
const noMsg = () => {
    throw new Error(`${magenta(DEVERR)}: Raised error without message`)
}

/**
 * @name throwErr
 * @description throws an error logging the msg
 * @param {String} msg
 * @param {String?} kind
 */
const throwErr = (msg, kind = RUNERR) => {
    if (!msg.trim()) noMsg()
    throw new Error(`${red(kind)}: ${msg}`)
}

/**
 * @name warn
 * @description warns by logging the msg
 * @param {String} msg
 */
const warn = msg => {
    if (!msg.trim()) noMsg()
    console.log(`${yellow('WARN:')} ${msg}`)
}

/**
 *
 * @param {String} msg
 * @param {String?} color
 * @param {Boolean?} verbose
 */
const inline = (msg, color, verbose = true) => {
    if (!msg.trim()) noMsg()
    if (!verbose) return
    if (color) msg = chalk[color](msg)
    process.stdout.write(msg)
}

/**
 *
 * @param {String} msg
 * @param {String?} color
 * @param {Boolean?} verbose
 */
const log = (msg, color, verbose = true) => {
    if (!msg.trim()) noMsg()
    if (!verbose) return
    if (color) msg = chalk[color](msg)
    console.log(msg)
}

/**
 * @name logOk
 */
const logOK = () => {
    log('OK', GREEN)
}

/**
 * @name interactiveFail
 * @description Logs a 'whatever' message when shit happens
 * @param {Error} err
 */
const interactiveFail = err => {
    console.error(`System failure while processing interactive data collection. \nReason ${err.message}`)
    process.exit(1)
}

module.exports = {
    noMsg,
    throwErr,
    warn,
    inline,
    log,
    logOK,
    interactiveFail
}