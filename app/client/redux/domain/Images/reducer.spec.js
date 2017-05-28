/* eslint-disable func-names, prefer-arrow-callback */
import { assert } from 'chai';

import reducer, { initialState } from './reducer';

describe('redux/images/reducer', function () {
  it('should return the initial state', function () {
    const state = reducer(undefined, 'bogus');
    assert.deepEqual(state, initialState, 'Did not return initial state.');
  });
});
