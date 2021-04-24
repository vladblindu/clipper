// noinspection HttpUrlsUsage

const {DEFAULT_SSG_HOST, DEFAULT_SSG_PORT} = require('./config')

module.exports.hook = `
const {basename} = require('path')
const axios = require('axios')

const ssgUrl = 'http://${process.env['SSG_HOST'] || DEFAULT_SSG_HOST}:${process.env['SSG_PORT'] || DEFAULT_SSG_PORT}'
const model = basename(__filename.replace('.js', ''))

module.exports = {
    lifecycles: {
        afterUpdate: async ({pkg}) => {
            await axios.post(ssgUrl, {pkg: pkg.name, model})
                .catch(e => {
                        console.error(e.message)
                    }
                )
        }
    }
}
`