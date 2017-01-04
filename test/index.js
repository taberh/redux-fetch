/* global describe, it */

import chai from 'chai'
import fetchMiddleware, {
  STATUS_REQUEST,
  STATUS_SUCCESS,
  STATUS_FAILURE,
  configureOptions
} from '../src/'

const assert = chai.assert

describe('redux-fetch middleware', () => {
  describe('exports', () => {
    it('typeof function', () => {
      assert.typeOf(fetchMiddleware, 'function')
    })

    it('typeof function', () => {
      assert.typeOf(configureOptions, 'function')
    })

    describe('constant STATUS_REQUEST', () => {
      it('typeof string', () => {
        assert.typeOf(STATUS_REQUEST, 'string')
      })
      it('equal "request"', () => {
        assert.equal(STATUS_REQUEST, 'request')
      })
    })

    describe('constant STATUS_SUCCESS', () => {
      it('typeof string', () => {
        assert.typeOf(STATUS_SUCCESS, 'string')
      })
      it('equal "request"', () => {
        assert.equal(STATUS_SUCCESS, 'success')
      })
    })

    describe('constant STATUS_FAILURE', () => {
      it('typeof string', () => {
        assert.typeOf(STATUS_FAILURE, 'string')
      })
      it('equal "request"', () => {
        assert.equal(STATUS_FAILURE, 'failure')
      })
    })
  })

  describe('configureOptions function', () => {
    configureOptions({
      headers: {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1'
      },
      method: 'GET'
    })

    it('fetchMiddleware.defaultOptions.method equal "GET"', () => {
      assert.equal(fetchMiddleware.defaultOptions.method, 'GET')
    })
  })

  describe('fetchMiddleware.then', () => {
    it('fetchMiddleware.then return fetchMiddleware.then', () => {
      assert.equal(fetchMiddleware.then(), fetchMiddleware.then)
    })
  })

  describe('fetch middleware', () => {
    const doDispatch = () => {}
    const doGetState = () => {}
    const nextHandler = fetchMiddleware({dispatch: doDispatch, getState: doGetState})

    it('must return a function to handle next', () => {
      assert.isFunction(nextHandler)
      assert.strictEqual(nextHandler.length, 1)
    })

    describe('handle next', () => {
      it('must return a function to handle action', () => {
        const actionHandler = nextHandler()

        assert.isFunction(actionHandler)
        assert.strictEqual(actionHandler.length, 1)
      })

      describe('handle action', () => {
        it('must pass action to next if not a fetch type object', done => {
          const actionObj = {}

          const actionHandler = nextHandler(action => {
            chai.assert.strictEqual(action, actionObj)
            done()
          })

          actionHandler(actionObj)
        })

        it('must return the return value of next if not a type object', () => {
          const expected = 'redux'
          const actionHandler = nextHandler(() => expected)

          const outcome = actionHandler()
          assert.strictEqual(outcome, expected)
        })

        describe('handle fetch type action', function () {
          const doGetState = () => {}

          fetchMiddleware.then((response) => {
            console.log('2', response.status)
            return response.json()
          })

          it('must dispatch success status action', done => {
            let count = 0
            const ACTION_TYPE = 'fetchDataSuccess'
            const doDispatch = (action) => {
              assert.equal(action.type, ACTION_TYPE)
              assert.typeOf(action, 'object')
              assert.typeOf(action.status, 'string')

              switch (action.status) {
                case STATUS_REQUEST:
                  count++
                  break
                case STATUS_SUCCESS:
                  assert.typeOf(action.payload, 'object')
                  count++
                  break
              }

              if (count === 2) done()
            }
            const nextHandler = fetchMiddleware({dispatch: doDispatch, getState: doGetState})
            const actionHandler = nextHandler()

            actionHandler({
              type: ACTION_TYPE,
              endpoint: 'http://mock.avosapps.com/test'
            })
          })

          it('must dispatch failure status action', done => {
            let count = 0
            const ACTION_TYPE = 'fetchDataFailure'
            const doDispatch = (action) => {
              assert.equal(action.type, ACTION_TYPE)
              assert.typeOf(action, 'object')
              assert.typeOf(action.status, 'string')

              switch (action.status) {
                case STATUS_REQUEST:
                  count++
                  break
                case STATUS_FAILURE:
                  assert.isDefined(action.error)
                  count++
                  break
              }

              if (count === 2) done()
            }
            const nextHandler = fetchMiddleware({dispatch: doDispatch, getState: doGetState})
            const actionHandler = nextHandler()

            actionHandler({
              type: ACTION_TYPE,
              endpoint: 'https://api.github.com/users/taberhuang'
            })
          })
        })
      })
    })

    describe('handle error', () => {
      it('must throw if argument is non-object', done => {
        try {
          fetchMiddleware()
        } catch (err) {
          done()
        }
      })
    })
  })
})
