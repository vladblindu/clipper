#!/usr/local/bin/node
const {collector} = require('./lib/collector')
const cli = require('./lib/cli')
const chalk = require('chalk')
const {version} = require('./package.json')
require('dotenv').config()

cli.version(version, '-v, --ver', 'display the current ver')

collector().forEach(
    comData => {
        return cli.addCommand(comData)
    }
)

// for a very hack-ish but efficient testing uncomment the line below
// process.chdir('/Users/vlad/Documents/zecode/@lib/clipper/test/__fixtures__/fda/packages/package2')

console.log(chalk.blue('Clipper- house keeper project manager'))
cli.parse(process.argv)