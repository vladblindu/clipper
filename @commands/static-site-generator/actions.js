const {join} = require('path')
const express = require('express')
const {findRoot, readJson} = require('../../lib/helpers/fs')
const {throwErr} = require('../../lib/helpers/console')
const {getStaticComponents, setupHook} = require('./helpers')
const {PKG} = require('../../lib/constants')

const setupHooks = () => {

    let modelPath = ''
    let [pkg] = findRoot()

    if (!pkg[WS_MAP_KEY])
        throwErr('Root package json has no wsMap key meaning you should run the "ini -m" command first to map the packages')

    try {
        modelPath = Object.values(pkg[WS_MAP_KEY]).reduce(
            /**
             *
             * @param {string} acc
             * @param {string} pth
             * @returns {string}
             */
            (acc, pth) => {
            const pkg = readJson(join(pth, PKG))
            if (pkg['static-site-generator']) acc = join(pth, pkg['static-site-generator']['modelPath' || 'api'])
            return acc
        }, '')
        if(!modelPath)
            throwErr('No static server found. Please set the "static-site-generator" key to true in the static server\'s package.json file and')
    } catch(e) {
        throwErr(e)
    }

    Object.values(pkg[WS_MAP_KEY]).forEach(
        root => {
            getStaticComponents(root).forEach(
                comp => {
                    setupHook(comp, modelPath)
                }
            )
        }
    )
}

const ssgWatch = () => {
    const app = express()
    app.use(express.json())
    const {SSG_PORT} = process.env


    app.listen(SSG_PORT, () => {
        console.log(`SSG server started on ${SSG_PORT}`)
    })

    // app.get('/', async (req, res) => {
    //
    // })
}

module.exports = {
    setupHooks,
    ssgWatch
}