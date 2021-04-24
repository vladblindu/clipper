const {join, resolve} = require('path')
const {readFileSync, writeFileSync} = require('fs-extra')
process.chdir(resolve(__dirname, '../'))

const readJson = (fl = './package.json') =>
    JSON.parse(readFileSync(fl, 'utf8'))

const {config} = readJson()
const theme = readJson(join(config.dirs.config, config.files.theme))

const sass = Object.keys(theme.colors).map(c => `$${c}: ${theme.colors[c]};`)

config['webPackages'].forEach(
    wp => writeFileSync(join(wp, config['scssThemeFile']), sass.join('\n'))
)
