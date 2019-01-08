'use strict'
const Koa = require('koa')
const bodyparser = require('koa-bodyparser')
const Router = require('koa-router')
const config = require('config')
const mongoose = require('mongoose')
const ilog = require('ilog')
const middlewares = require('./middleware')

process.on('uncaughtException', function (err) {
  ilog.error({ name: 'UncaughtExceptionError', message: err })
})

const app = new Koa()

mongoose.connect(
  `${config.mongo.host}`,
  {
    useNewUrlParser: true,
    user: config.mongo.user,
    pass: config.mongo.password,
    dbName: config.mongo.db
  }
)

app.use(middlewares.error)
app.use(middlewares.accessLogger)
app.use(bodyparser())

const router = new Router()
require('./router')(router)

app.use(router.routes())
app.use(router.allowedMethods())

module.exports = app.listen(config.app.port, function () {
  ilog.info(`${config.app.name} is listening at http://127.0.0.1:${config.app.port}, god bless it.`)
})
