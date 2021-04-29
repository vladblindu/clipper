const camelToDash = s => s.replace(/[A-Z]/g, '-$&').toLowerCase()

module.exports = {
    camelToDash
}