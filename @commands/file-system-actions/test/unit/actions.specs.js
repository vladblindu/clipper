// const {expect} = require("chai")
// const {createLink} = require("../../actions")
// const {join, resolve} = require("path";)
// const {writeFileSync, unlinkSync, lstatSync} = require("fs";)
// const {PKG} = require("../../../../lib/constants";)
//
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
