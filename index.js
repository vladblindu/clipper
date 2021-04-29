#!/usr/local/bin/node

require('./lib/config')
const commands = require('./lib/collector')
const cli = require('./lib/cli')
const {blue} = require('chalk')
const {version} = require('./package.json')

cli.version(version, '-v, --ver', 'display the current ver')

// collect all submodules commands
commands.forEach(comData => cli.addCommand(comData))

console.log(blue('Clipper- house keeper project manager'))
cli.parse(process.argv)