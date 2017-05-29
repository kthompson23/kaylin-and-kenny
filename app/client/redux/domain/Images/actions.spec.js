/* eslint-disable func-names, prefer-arrow-callback */
import { assert } from 'chai';

import actions from './actions';
import {
  IS_FETCHING,
  FETCH_ERROR,
  RECEIVE_IMAGES,
} from './constants';

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

  describe.skip('action thunks');
});
