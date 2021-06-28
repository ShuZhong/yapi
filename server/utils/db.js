import mongoose from 'mongoose'

import yapi from '../yapi.js'

import autoIncrement from './mongoose-auto-increment'

function model(model, schema) {
  if (!(schema instanceof mongoose.Schema)) {
    schema = new mongoose.Schema(schema)
  }

  schema.set('autoIndex', false)

  return mongoose.model(model, schema, model)
}

function connect(callback) {
  /* mongoose 5.0 之后不需要了，待删除 */
  // mongoose.Promise = global.Promise

  mongoose.set('useNewUrlParser', true)
  mongoose.set('useFindAndModify', false)
  mongoose.set('useCreateIndex', true)

  const config = yapi.WEBCONFIG
  let options = { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }

  if (config.db.user) {
    options.user = config.db.user
    options.pass = config.db.pass
  }

  options = { ...options, ...config.db.options }

  let connectString = ''

  if (config.db.connectString) {
    connectString = config.db.connectString
  } else {
    connectString = `mongodb://${config.db.servername}:${config.db.port}/${config.db.DATABASE}`
    if (config.db.authSource) {
      connectString = connectString + `?authSource=${config.db.authSource}`
    }
  }

  const db = mongoose.connect(
    connectString,
    options,
    function (err) {
      if (err) {
        yapi.commons.log(err + ', mongodb Authentication failed', 'error')
      }
    },
  )

  db.then(
    function () {
      yapi.commons.log('mongodb load success...')

      if (typeof callback === 'function') {
        callback.call(db)
      }
    },
    function (err) {
      yapi.commons.log(err + 'mongodb connect error', 'error')
    },
  )

  autoIncrement.initialize(db)
  return db
}

export default {
  model: model,
  connect: connect,
}
