const {expect} = require('chai')
const {addToGitIgnore} = require('../../actions')
const {join, resolve} = require('path')
const {writeFileSync, readFileSync} = require('fs')

describe('addToGitIgnore', () => {

    it('should add links to git ignore', () => {

        const gitignorePath = resolve(join(__dirname, '../__fixtures__/.gitignore'))

        writeFileSync(gitignorePath,
            '# test comment\n' +
            'node_modules\n' +
            '.idea\n' +
            '**/other-stuff\n' +
            '# another comment\n' +
            '# pkg: @package2/test-pack\n' +
            '**/to-be-deleted\n' +
            '# pkg: @package1/test-pack\n' +
            '.other-stuff\n' +
            '**/rest')

        addToGitIgnore('package2')

        const gitIgnore = readFileSync(gitignorePath, 'utf8')

        expect(gitIgnore).to.equal('# test comment\n' +
            'node_modules\n' +
            '.idea\n' +
            '**/other-stuff\n' +
            '# another comment\n' +
            '# pkg: @package2/test-pack\n' +
            'packages/package2/README.md\n' +
            'packages/package2/testDir/folder1\n' +
            '# pkg: @package1/test-pack\n' +
            '.other-stuff\n' +
            '**/rest')
    })
})

// const safeLog = console.log
// mockLog = msg => {
//      expect(msg.endsWidth('running this command.'))
// }
// console.log = mockLog
// .....
// console.log = safeLog

//
// describe("createLinks", () => {
//     const cwd = process.cwd()
//     const folderLink = resolve(join(__dirname, '../', '__fixtures__/packages/package2/directory1/test-folder'))
//     const readmeLink = resolve(join(__dirname, '../', '__fixtures__/packages/package2/README.md'))
//     const setCwd = () => {
//         process.chdir(resolve(join(__dirname, '../', '__fixtures__/packages/package2')))
//     }
//
//     const resetCwd = () => {
//         process.chdir(cwd)
//     }
//     const putRootPackageJson = () => {
//         const pkg = {
//             name: 'test-root-pkg',
//             workspaces:[
//                 'packages/*'
//             ],
//             wsMap: {
//                 'package1': resolve(join(__dirname, '../', '__fixtures__/packages/package1')),
//                 'package2': resolve(join(__dirname, '../', '__fixtures__/packages/package2'))
//             }
//         }
//         try {
//             writeFileSync(
//                 join(resolve(__dirname, '..', '__fixtures__'), PKG),
//                 JSON.stringify(pkg, null, 2)
//             )
//         } catch(e){
//             console.log(e.messages)
//         }
//     }
//     const cleanUp = () => {
//         unlinkSync(resolve(join(__dirname, '../', '__fixtures__/packages/package2/README.md')))
//         unlinkSync(resolve(join(__dirname, '../', '__fixtures__/packages/package2/directory1/test-folder')))
//     }
//
//     before(putRootPackageJson)
//
//     beforeEach(setCwd)
//
//     afterEach(() => {
//         cleanUp()
//         resetCwd()
//     })
//
//     it("Should create links", () => {
//         createLinks("package2")
//         expect(lstatSync(folderLink).nlink).to.equal(1)
//         expect(lstatSync(readmeLink).nlink).to.equal(1)
//     })
//
//     it("Should overwrite links", () => {
//         createLinks("package2")
//         createLinks("package2")
//         expect(lstatSync(folderLink).nlink).to.equal(1)
//         expect(lstatSync(readmeLink).nlink).to.equal(1)
//     })
// })
