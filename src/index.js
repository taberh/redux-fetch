/* global fetch */

import _ from 'lodash'

if (typeof fetch === 'undefined') {
  require('es6-promise').polyfill()
  require('isomorphic-fetch')
}

export const STATUS_REQUEST = 'request'
export const STATUS_SUCCESS = 'success'
export const STATUS_FAILURE = 'failure'

let fetchMiddleware = createReduxFetchMiddleware()
let defaultOptions = fetchMiddleware.defaultOptions = {}
let thenQueue = [[
  (response) => {
    if (response.status >= 400) {
      throw Error(response.statusText)
    }
    return response
  }
]]

fetchMiddleware.then = function (onFulfilled, onRejected) {
  if (arguments.length) {
    thenQueue.push([onFulfilled, onRejected])
  }
  return fetchMiddleware.then
}

export default fetchMiddleware

/**
 * configureOptions
 * @param  {object} options
 * @return
 */
export function configureOptions (options) {
  defaultOptions = _.assign(defaultOptions, options)
}

/**
 * redux fetch middleware
 * @param  {object} store
 * @return {function}
 */
function createReduxFetchMiddleware () {
  return ({ dispatch, getState }) => next => action => {
    if (action && action.endpoint) {
      dispatch(_.assign({}, action, {
        status: STATUS_REQUEST
      }))

      let queue = thenQueue.concat([[
        (response) => {
          dispatch(_.assign({}, action, {
            status: STATUS_SUCCESS,
            payload: response
          }))
        }
      ]])

      let response = fetch(action.endpoint, _.assign({}, defaultOptions, action))

      _.forEach(queue, (item, i) => {
        response = response.then.apply(response, item)
      })

      response.catch((error) => {
        dispatch(_.assign({}, action, {
          status: STATUS_FAILURE,
          error
        }))
      })

      return
    }

    return next(action)
  }
}
