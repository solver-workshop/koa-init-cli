'use strict'
const fs = require('fs')
const path = require('path')
const { promisify } = require('util')
const initCli = require('commander')
const inquirer = require('inquirer')
const ilog = require('ilog')
const copy = require('copy-template-dir')
const pkg = require('../package')

initCli.version(pkg.version)

initCli.command('create <dirName>')
  .description('create an new koa project')
  .action(function (dirName) {
    ;(async function () {
      const dir = path.join(process.cwd(), dirName)

      if (fs.existsSync(dir)) {
        console.error(`[koa-init-cli] ERROR: "${dir}" already exists.`)
        process.exit(1)
      }

      const { prjectName } = await inquirer.prompt({
        name: 'prjectName',
        message: 'project name',
        default: 'example'
      })

      const { description } = await inquirer.prompt({
        name: 'description',
        message: 'project description'
      })

      const { author } = await inquirer.prompt({
        name: 'author',
        message: 'project author'
      })

      const { license } = await inquirer.prompt({
        name: 'license',
        message: 'project license',
        type: 'list',
        choices: ['MIT', 'Apache-2.0', 'UNLICENSED'],
        default: 'MIT'
      })

      await promisify(copy)(
        path.join(__dirname, '../boilerplate'),
        dir,
        { prjectName, description, author, license }
      )

      switch (license) {
        case 'MIT':
          fs.copyFileSync(
            path.join(__dirname, '../licenses/MIT.md'),
            path.join(dir, './LICENSE')
          )
          break
        case 'Apache-2.0':
          fs.copyFileSync(
            path.join(__dirname, '../licenses/Apache-2.0.md'),
            path.join(dir, './LICENSE')
          )
          break
        default:
          break
      }

      console.log(`
[koa-init-cli] Job done!
               - cd ${dir}
               - npm i
               - npm run dev`
      )
      process.exit(0)
    })().catch(ilog.error)
  })

initCli.parse(process.argv)
