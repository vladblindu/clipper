const {
    COMMAND_DIR_KEY,
    COMMAND_GLOB_KEY,
    LOCALES_INDEX_KEY,
} = require('./lib/constants')

const DEFAULT_APP_NAME = 'clipper-project'
const DEFAULT_APP_DOMAIN = 'redcat-studios.uk'
const DEFAULT_DESCRIPTION = 'Bare-bones Clipper managed project'
const DEFAULT_AUTH_DAEMON = 'auth-daemon'
const DEFAULT_WEBADMIN = 'admin'
const DEFAULT_LANGS = [
    'en',
    'ro'
]

const DEFAULT_CONFIG_ROOT = {
    root: '__config__',
    globalConfig: 'global|json'
}

const DEFAULT_PUBLIC_ROOT = {
    root: '__public__',
    assets: 'assets',
    img: 'img',
    logo: 'logo',
    svg: 'svg',
    locales: 'locales'
}


const DEFAULT_RESOURCE_ROOT = {
    root: '__resources__',
    locales: 'locales',
    flags: 'flags',
    bitmap: 'bitmap',
    prototyping: 'prototyping',
    vector: 'vector'
}
const DEFAULT_STORAGE_ROOT = {
        root: '__storage__',
        media: 'media'
    }

const DEFAULT_LOGO_SIZES = [
    50,
    100,
    150,
    200,
    300,
    400,
    500,
    600
]


module.exports = {
    [COMMAND_DIR_KEY]: '@commands',
    [COMMAND_GLOB_KEY]: `**/index.js`,
    [LOCALES_INDEX_KEY]:'index.json',
    DEFAULT_APP_DOMAIN,
    DEFAULT_APP_NAME,
    DEFAULT_AUTH_DAEMON,
    DEFAULT_LANGS,
    DEFAULT_DESCRIPTION,
    DEFAULT_RESOURCE_ROOT,
    DEFAULT_CONFIG_ROOT,
    DEFAULT_WEBADMIN,
    DEFAULT_STORAGE_ROOT,
    DEFAULT_PUBLIC_ROOT,
    DEFAULT_LOGO_SIZES
}