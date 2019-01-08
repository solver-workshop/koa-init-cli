'use strict'
const initCli = require('commander')
const inquirer = require('inquirer')
const ilog = require('ilog')
const pkg = require('../package')

initCli.version(pkg.version)

initCli.command('create <dirName>')
  .description('create an new koa project')
  .action(function (dirName) {
    ;(async function () {
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
        choices: ['MIT', 'Apache', 'UNLICENSED'],
        default: 'MIT'
      })

      ilog.info({ dirName, prjectName, description, author, license })
    })().catch(ilog.error)
  })

initCli.parse(process.argv)
