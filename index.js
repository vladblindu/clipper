#!/usr/local/bin/node

const {collector} = require('./lib/collector')
const cli = require('./lib/cli')
const {blue} = require('chalk')
const {findEnv} = require('./lib/helpers/fs')
const {version} = require('./package.json')

const env = findEnv()
console.log(env)
require('dotenv').config({
    path: env
})

cli.version(version, '-v, --ver', 'display the current ver')

collector().forEach(
    comData => {
        return cli.addCommand(comData)
    }
)

// for a very hack-ish but efficient testing uncomment the line below
// process.chdir('/Users/vlad/Documents/zecode/@lib/clipper/test/__fixtures__/fda/packages/package2')

console.log(blue('Clipper- house keeper project manager'))
cli.parse(process.argv)