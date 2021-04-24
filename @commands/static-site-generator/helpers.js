const {dirname, join, sep} = require('path')
const {existsSync, statSync, writeFileSync} = require('fs')
const glob = require('glob')
const {hookFile} = require('./hook')
const {STATIC_PROPS_FILE} = require('./config')


const getStaticComponents = root =>
    glob.sync(`**/${STATIC_PROPS_FILE}`, {cwd: root})
        .reduce(   (acc, pth) => {
            acc[dirname(pth).split(sep).pop()] = pth
            return acc
        })

const hookPath = (comp, modelPath, models = 'models') => {
    if (existsSync(join(modelPath, comp)) && statSync(join(modelPath, comp)).isDirectory())
        return join(modelPath, comp, models, comp + '.js')
    comp = comp.replace(/([A-Z])/g, (c, _, idx) => !idx
        ? c.toLowerCase()
        : '-' + c.toLowerCase()
    )
    if (existsSync(join(modelPath, comp)) && statSync(join(modelPath, comp)).isDirectory())
        return join(modelPath, comp, models, comp + '.js')
}

const setupHook = (comp, modelPath) => {
    writeFileSync(
        hookPath(comp, modelPath),
        hookFile)
}

module.exports = {
    getStaticComponents,
    hookPath,
    setupHook
}