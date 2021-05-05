const {readFileSync, unlinkSync, writeFileSync} = require('fs')
const {join, resolve} = require('path')
const {expect} = require('chai')
const {
    findPackage,
    findRoot,
    getPackage,
    mapPackages,
    putPackage,
    registerWsMap,
    pathFromObj
} = require('../../lib/helpers/fs')
const {PKG, WORKSPACE} = require('../../lib/constants')

describe('fs unit tests', () => {

    const cwd = process.cwd()
    const testWsRoot = resolve(__dirname, '../__fixtures__/fs/package.json')

    const setCwd = () => {
        process.chdir(resolve(join(__dirname, '../', '__fixtures__/fs/packages/package2')))
    }

    const resetCwd = () => {
        process.chdir(cwd)
    }

    const resetPkg = () => {
        const pkg = JSON.parse(readFileSync(testWsRoot, 'utf8'))
        if (pkg.wsMap) {
            delete pkg.wsMap
            writeFileSync(testWsRoot, JSON.stringify(pkg, null, 2))
        }
    }

    const insertWsMap = () => {
        const pkg = JSON.parse(readFileSync(testWsRoot, 'utf8'))
        pkg[WS_MAP_KEY] = map
        writeFileSync(testWsRoot, JSON.stringify(pkg, null, 2))
    }

    const map = {
        'package1': resolve(join(__dirname, '../', '__fixtures__/fs/packages/package1')),
        'package2': resolve(join(__dirname, '../', '__fixtures__/fs/packages/package2'))
    }

    describe('getPackage', () => {

        beforeEach(() => {
            setCwd()
        })

        afterEach(() => {
            resetCwd()
        })

        it('should get a specified package.json', () => {
            const pkgPath = resolve(join(__dirname, '../', '__fixtures__/fs/packages/package1', PKG))
            expect(getPackage(pkgPath).name).to.equal('@package1/test-pack')
        })

        it('should throw if no packages found', () => {
            const pkgPath = resolve(join(__dirname, '../', '__fixtures__', PKG))
            expect(() => {
                getPackage(pkgPath)
            }).to.throw(Error).that.satisfies(error => {
                return error.message.slice(18, 37) === 'Couldn\'t read/find '
            })
        })
    })

    describe('putPackages', () => {
        const pkgPath = resolve(join(__dirname, '../', '__fixtures__'))

        const cleanUp = () => {
            unlinkSync(join(pkgPath, PKG))
        }

        beforeEach(() => {
            setCwd()
        })

        afterEach(() => {
            cleanUp()
            resetCwd()
        })

        it('should put the package json', () => {
            const pkg = {
                name: 'test-package'
            }

            putPackage(pkg, pkgPath)
            const _pkg = JSON.parse(readFileSync(join(pkgPath, PKG), 'utf8'))
            expect(_pkg.name).to.eql('test-package')
        })
    })

    describe('findRoot', () => {

        afterEach(() => {
            resetCwd()
        })

        it('should get the right path and package for monorepo root', () => {
            setCwd()
            const [wsPkg, wsRoot] = findRoot()
            expect(wsPkg[WORKSPACE]).to.be.ok
            expect(wsRoot).to.equal(resolve(join(__dirname, '../', '__fixtures__/fs')))
        })

        it('should get the right path and package for monorepo root', () => {
            process.chdir('/usr/local/bin')
            expect(() => {
                findRoot()
            }).to.throw(Error).that.satisfies(error => {
                return error.message.endsWith('monorepo workspace.')
            })
        })
    })

    describe('findPackage', () => {

        beforeEach(() => {
            setCwd()
            insertWsMap()
        })
        afterEach(() => {
            resetCwd()
            resetPkg()
        })


        it('should get the right path and package if no pkg specified', () => {
            const [pkg, root] = findPackage()
            expect(pkg['name']).to.equal('@package2/test-pack')
            expect(root).to.equal(resolve(join(__dirname, '../', '__fixtures__/fs/packages/package2')))
        })

        it('should get the right path and package', () => {
            const [pkg, root] = findPackage('package1')
            expect(pkg['name']).to.equal('@package1/test-pack')
            expect(root).to.equal(resolve(join(__dirname, '../', '__fixtures__/fs/packages/package1')))
        })
    })

    describe('mapPackages', () => {

        beforeEach(() => {
            setCwd()
        })
        afterEach(() => {
            resetCwd()
        })

        it('should map the packages', () => {
            const root = resolve(join(__dirname, '../', '__fixtures__/fs'))
            const pkg = require(join(root, 'package.json'))
            const pkgMap = mapPackages(pkg, root)
            expect(pkgMap).to.deep.equal(map)
        })
    })

    describe('registerWsMap', () => {

        beforeEach(() => {
            setCwd()
            resetPkg()
        })

        afterEach(() => {
            resetPkg()
            resetCwd()
        })

        it('should map the packages', () => {
            registerWsMap()
            const pkg = JSON.parse(readFileSync(testWsRoot, 'utf8'))
            expect(pkg.wsMap).to.deep.equal(map)
        })
    })

    describe('pathFromObj', () => {

        it('should build the right path for simple obj', () => {
            const testObj = {
                'root': 'root',
                'dir1': {
                    'dir2': 'dir2',
                    'dir3': 'dir3',
                    'dir4': 'dir4'
                },
                'dir5': {
                    'dir6': 'dir6'
                }
            }
            expect(pathFromObj('dir6', testObj)).to.equal('dir5/dir6')
        })

        it('should build the right path for complex obj', () => {
            const testObj = {
                root: 'root',
                dir1: 'dir1',
                dir2: {
                    dir3: {
                        dir4: 'dir4'
                    }
                },
                dir5: 'dir5'
            }
            expect(pathFromObj('dir4', testObj)).to.equal(join('root', 'dir2', 'dir3', 'dir4'))
        })
    })
})