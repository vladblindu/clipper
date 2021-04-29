const {join, basename} = require('path')
const {existsSync} = require('fs')
const {readJson, writeJson} = require('../../lib/helpers/fs')
const {warn, log, inline, logOK, throwErr} = require('../../lib/helpers/console')
const {PNG_EXT, JSON_EXT, RESOURCE_ROOT_KEY, LOCALES_INDEX_KEY} = require('../../lib/constants')
const {camelToDash} = require('../../lib/helpers/strings')

const init = () => {
    log('Generating locales data:')
    const localesRoot = config.path('locales', RESOURCE_ROOT_KEY)
    const flagsRoot = config.path('flags', RESOURCE_ROOT_KEY)
    if(!existsSync(localesRoot))
        throwErr(`Invalid locales path ${localesRoot}.`)
    if(!existsSync(flagsRoot))
        throwErr(`Invalid flags path ${flagsRoot}.`)
    const localesFiles = readJson(join(localesRoot, config[LOCALES_INDEX_KEY])).reduce(
        (acc, lng) => {
            acc.langList.push(lng.lang)
            acc.codeList.push(lng.code)
            acc.flagList.push(lng.flag)
            acc.codeToLang[lng.code] = lng.lang
            acc.langToCode[lng.lang] = lng.code
            acc.codeToFlag[lng.code] = lng.flag
            acc.flagToCode[lng.flag] = lng.code
            acc.flagToLang[lng.flag] = lng.lang
            acc.langToFlag[lng.lang] = lng.flag

            const flag = lng.flag.endsWith(PNG_EXT) ? lng.flag : lng.flag + PNG_EXT
            if(!existsSync(join(flagsRoot, flag)))
                warn('Please update the flag file name (-f oro --flag new flag file name). The actual one is miss-matched or missing.')
            return acc
        }, {
            langList: [],
            codeList: [],
            flagList: [],
            codeToLang: {},
            langToCode: {},
            langToFlag: {},
            flagToLang: {},
            codeToFlag: {},
            flagToCode: {}
        }
    )
    Object.keys(localesFiles).forEach(
        k => {
            const fn = join(localesRoot, camelToDash(k))
            inline(`Creating ${basename(fn)}${JSON_EXT}...`)
            writeJson(fn, localesFiles[k])
            logOK()
        }
    )
}

module.exports = {
    init
}