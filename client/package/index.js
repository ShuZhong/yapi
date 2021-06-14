import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import moox from 'moox'
import PropTypes from 'prop-types'

import App from './App.js'
import * as utils from './utils'
import schema from './models/schema'

module.exports = (config = {}) => {
  if (config.lang) { utils.lang = config.lang }
  
  const Model = moox({
    schema,
  })
  if (config.format) {
    Model.__jsonSchemaFormat = config.format
  } else {
    Model.__jsonSchemaFormat = utils.format
  }

  if (config.mock) {
    Model.__jsonSchemaMock = config.mock
  }

  const store = Model.getStore()

  const Component = props => <Provider store={store} className="wrapper">
    <App Model={Model} {...props} />
  </Provider>

  Component.propTypes = {
    data: PropTypes.string,
    onChange: PropTypes.func,
    showEditor: PropTypes.bool,
  }
  return Component

}

