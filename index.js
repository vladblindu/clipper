#!/usr/local/bin/node

const {collector} = require('./lib/collector')
const cli = require('./lib/cli')
const {blue} = require('chalk')
const {findEnv} = require('./lib/helpers/fs')
const {version} = require('./package.json')

// if this not an action run by GITHUB check for a local .env file
if (!process.env.CI)
    require('dotenv').config({
        path: findEnv()
    })

cli.version(version, '-v, --ver', 'display the current ver')

// collect all submodules commands
collector().forEach(
    comData => {
        return cli.addCommand(comData)
    }
)

console.log(blue('Clipper- house keeper project manager'))
cli.parse(process.argv)