#!/usr/bin/node

const fs = require('fs')
const path = require('path')

const testEnv = {
    key1: 'value1',
    key2: 'value2',
    key3: 'value3'
}

fs.writeFileSync(
    path.join(__dirname, './env cache.json'),
    JSON.stringify(testEnv, null, 2))