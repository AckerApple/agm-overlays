const fs = require('fs')

const rootPack = require('../package.json')
const packPath = require.resolve('../dist/package.json')
const pack = require(packPath)

pack.version = rootPack.version
pack.jsDependencies = rootPack.jsDependencies
delete pack.private;
fs.writeFileSync(packPath, JSON.stringify(pack, null, 2))
const path = require('path')

const fromReadMe = path.join(packPath,'../../','README.md')
const toReadMe = path.join(packPath,'../','README.md')
fs.writeFileSync(toReadMe, fs.readFileSync(fromReadMe))

function manageExample(){
  const exPackPath = require.resolve('../example/package.json')
  const exPack = require(exPackPath)
  exPack.devDependencies = rootPack.devDependencies
  delete exPack.private;
  fs.writeFileSync(exPackPath, JSON.stringify(exPack, null, 2))
}

//manageExample()