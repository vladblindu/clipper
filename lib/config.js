const {join} = require('path')
const {readFileSync} = require('fs')
const {findEnv, findRoot, readJson, pathFromObj} = require('./helpers/fs')
const {throwErr} = require('./helpers/console')
const {pick} = require('./helpers/obj')
const {CONFIG_ROOT_KEY} = require('./constants')
const localCfg = require('../clipper.config')

class Config {
    constructor() {
        this._envPth = findEnv()

        // if this not an action run by GITHUB check for a local .env file
        if (!process.env.CI)
            require('dotenv').config({
                path: this._envPth
            })

        const envList = readFileSync(this._envPth, 'utf8')
            .split('\n')
            .filter(ln => !ln.trim().startsWith('#') && ln.includes('='))
            .map(ln => ln.split('=')[0].trim())

        const [pkg, root] = findRoot()

        this._wsPkg = pkg
        this._wsRoot = root

        Object.keys(localCfg).forEach(k => this[k] = localCfg[k])

        this._appCfg = readJson(join(root, pkg[CONFIG_ROOT_KEY]))

        this._env = pick(process.env, envList)
        this.path = this.path.bind(this)
        this.app = this.app.bind(this)
        this.ws = this.ws.bind(this)
        this.env = this.env.bind(this)
    }

    path(key, base, rel = false) {
        if(!key && !base)
            throwErr('No key and no base specified')
        if(!base && this._appCfg[key] && this._appCfg[key].root)
            return this._appCfg[key].root
        else throwErr(`Unspecified base. ${key} is not a root directory.`)
        if (base) return rel
            ? pathFromObj(key, this._appCfg[base])
            : join(this._wsRoot, pathFromObj(key, this._appCfg[base]))
    }

    app(key) {
        return this._appCfg[key]
    }

    ws(key) {
        return key ? this._wsPkg[key] : this._wsRoot
    }

    env(key) {
        return this._env[key]
    }
}

global.config = new Config()

Object.freeze(config)