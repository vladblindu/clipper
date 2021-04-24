const {lstatSync} = require('fs')
const {join} = require('path')
const FtpClient = require('ftp')
const glob = require('glob')
const {throwErr} = require('../../lib/helpers/console')

class Deployment extends FtpClient {
    constructor(publicDir, destDir) {
        super()
        this.publicDir = publicDir
        this.destDir = destDir || '/'
        this.connect({
            host: process.env.DEV_FTP_HOST,
            password: process.env.DEV_FTP_PASSWORD,
            user: process.env.DEV_FTP_USER,
            port: 21,
            passive: true
        })

        this.on(
            'ready', () => {
                const files = glob.sync(`**/*`, {
                    cwd: this.publicDir || './__public__'
                })
                files.forEach(this.handlePath)
            }
        )
        this.on('error', err => {
            throwErr(err.message)
        })

        this.createDir = this.createDir.bind(this)
        this.uploadFile = this.uploadFile.bind(this)
        this.handlePath = this.handlePath.bind(this)
    }


    createDir(dir) {
        return this.mkdir(dir, true, err => {
            if (err) throw err
            this.end()
        })
    }

    uploadFile(file, dest) {
        this.put(file, dest, (error) => {
            if (error) throw error
            console.log(`${file} => ${dest}`)
            this.end()
        })
    }

    handlePath(pth) {
        const dest = join(this.destDir, pth)
        const src = join(this.publicDir, pth)
        if (lstatSync(src).isDirectory()) {
            return this.createDir(dest)
        }
        return this.uploadFile(pth, dest)
    }
}

module.exports = Deployment