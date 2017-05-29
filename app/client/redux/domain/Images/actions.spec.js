/* eslint-disable func-names, prefer-arrow-callback */
import { assert } from 'chai';
import moxios from 'moxios';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import api from 'api';
import actions from './actions';
import {
  IS_FETCHING,
  FETCH_ERROR,
  RECEIVE_IMAGES,
} from './constants';
import { initialState } from './reducer';

describe('images/actions', function () {
  describe('action creators', function () {
    it('should create an action to clear fetch errors', function () {
      const expectedActions = {
        type: FETCH_ERROR,
        fetchError: undefined,
      };

      assert.deepEqual(actions.clearFetchError(), expectedActions, 'Unexpected action');
    });

    it('should create an action to receive a list of images', function () {
      const event = '1stBDay';
      const images = ['image1', 'image2'];
      const resultHeader = {
        foo: 'bar',
      };

      const expectedActions = {
        type: RECEIVE_IMAGES,
        event,
        images,
        resultHeader,
      };

      assert.deepEqual(actions.receiveImages(event, images, resultHeader), expectedActions, 'Unexpected actions');
    });

    it('should create an action to update fetch errors', function () {
      const fetchError = new Error('error!');
      const expectedActions = {
        type: FETCH_ERROR,
        fetchError,
      };

      assert.deepEqual(actions.updateFetchError(fetchError), expectedActions, 'Unexpected actions');
    });

    it('should create an action to update the fetch status', function () {
      const isFetching = true;
      const expectedActions = {
        type: IS_FETCHING,
        isFetching,
      };

      assert.deepEqual(actions.updateFetchStatus(isFetching), expectedActions, 'Unexpected actions');
    });
  });

  describe('action thunks', function () {
    const middlewares = [thunk];
    const mockStore = configureMockStore(middlewares);
    let store;
    let tokenSource;

    beforeEach(function () {
      store = mockStore({ cart: initialState });
      tokenSource = api.getCancelTokenSource();
      moxios.install();
    });

    afterEach(function () {
      store.clearActions();
      moxios.uninstall();
    });

    describe('getImages', function () {
      const event = 'wedding';
      const page = 0;
      const limit = 25;

      it('should fetch images for an event', function () {
        const images = ['image1', 'image2'];
        moxios.wait(function () {
          const request = moxios.requests.mostRecent();
          request.respondWith({
            status: 200,
            response: {
              results: {
                images,
              },
              next: null,
              totalImages: images.length,
              totalPages: 1,
            },
          });
        });

        const expectedActions = [
          {
            type: IS_FETCHING,
            isFetching: true,
          },
          {
            type: IS_FETCHING,
            isFetching: false,
          },
          {
            type: RECEIVE_IMAGES,
            event,
            images,
            resultHeader: {
              next: null,
              page,
              totalImages: images.length,
              totalPages: 1,
            },
          },
        ];

        return store.dispatch(actions.getImages(tokenSource.token, event, page, limit))
          .then(function () {
            assert.deepEqual(store.getActions(), expectedActions, 'Unexpected actions');
          });
      });

      it('should not log an error or save on cancel', function () {
        moxios.wait(function () {
          // cancel the request
          tokenSource.cancel();
          const request = moxios.requests.mostRecent();
          request.respondWith({
            status: 200,
            response: {},
          });
        });

        // essentially mark the fetch as started and then stopped
        const expectedActions = [
          {
            type: IS_FETCHING,
            isFetching: true,
          },
          {
            type: IS_FETCHING,
            isFetching: false,
          },
        ];

        return store.dispatch(actions.getImages(tokenSource.token, event, page, limit))
          .then(function () {
            assert.deepEqual(store.getActions(), expectedActions, 'Unexpected actions');
          });
      });

      it('should log an error on a non 200 response', function () {
        moxios.wait(function () {
          const request = moxios.requests.mostRecent();
          request.respondWith({
            status: 500,
            message: 'Unexpected error',
          });
        });

        const expectedActions = [
          {
            type: IS_FETCHING,
            isFetching: true,
          },
          {
            type: IS_FETCHING,
            isFetching: false,
          },
          {
            type: FETCH_ERROR,
            fetchError: new Error('some error'),
          },
        ];

        return store.dispatch(actions.getImages(tokenSource.token, event, page, limit))
          .then(function () {
            const dispatchedActions = store.getActions();
            dispatchedActions.forEach(function (action, index) {
              assert.equal(action.type, expectedActions[index].type, 'Unexpected action');
            });
          });
      });
    });
  });
});
