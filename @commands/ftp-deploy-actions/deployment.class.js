const {join, relative} = require('path')
const {statSync} = require('fs')
const FtpClient = require('ftp')
const glob = require('glob')
const {blue, red} = require('chalk')
const {throwErr, logOK, inline, log} = require('../../lib/helpers/console')

class Deployment extends FtpClient {
    constructor(publicDir, destDir) {
        super()
        this.publicDir = publicDir
        this.destDir = destDir
        this.connect({
            host: process.env.DEV_FTP_HOST,
            password: process.env.DEV_FTP_PASSWORD,
            user: process.env.DEV_FTP_USER,
            port: 21
        })

        this.on(
            'ready', () => {
                const files = glob.sync(`**/*`, {
                    cwd: this.publicDir,
                    follow: true
                })
                files.forEach(this.handlePath)
                if(!files.length)
                    throwErr(`No files to upload found in: ${this.publicDir}`)
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
            if (err) throwErr(err.message)
            this.end()
        })
    }

    uploadFile(src, dest) {
        this.put(src, dest, err => {
            inline(`Uploaded ${blue(relative(this.publicDir, src))} to ${blue(dest)}...`)
            if (err) {
                log(red('ERROR'))
                throwErr(err.toString())
            }
            logOK()
            this.end()
        })
    }

    handlePath(pth) {
        const dest = join(this.destDir, pth)
        const src = join(this.publicDir, pth)
        if (statSync(src).isDirectory()) {
            return this.createDir(dest)
        }
        return this.uploadFile(src, dest)
    }
}

module.exports = Deployment