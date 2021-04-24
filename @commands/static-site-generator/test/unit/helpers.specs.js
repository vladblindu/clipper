const {join, resolve} = require('path')
const {expect} = require('chai')
const {getStaticComponents, hookPath} = require('../../helpers')

describe('findModels', () => {

    const packPath = resolve(__dirname, '../', '__fixtures__', 'base')

    it('should fin the models', () => {
        expect(getStaticComponents(packPath)).to.have.members([
            'TestComp',
            'TestSubComp',
            'TestSection'
        ])
    })
})

describe('hookPath', () => {

    const testPath = resolve(__dirname, '..', '__fixtures__', 'helpers', 'sync-model-ath-to-comp')

    it('should find the models for camel cased paths', () => {
        const comp = 'CamelCase'
        const modelPath = join(testPath, 'camel-cased')
        expect(hookPath(comp, modelPath)).to.equal(`${modelPath}/${comp}/models/${comp}.js`)
    })

    it('should find the models for dashed paths', () => {
        const comp = 'DashCased'
        const expectedComp = comp.replace(/([A-Z])/g, (c, _, idx) => !idx
            ? c.toLowerCase()
            : '-' + c.toLowerCase()
        )
        const modelPath = join(testPath, 'dash')
        expect(hookPath(comp, modelPath)).to.equal(`${modelPath}/${expectedComp}/models/${expectedComp}.js`)
    })
})