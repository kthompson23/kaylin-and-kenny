/* eslint-disable func-names, prefer-arrow-callback */
import { assert } from 'chai';

import reducer, { initialState } from './reducer';
import { FETCH_ERROR, IS_FETCHING, RECEIVE_IMAGES } from './constants';

describe('redux/images/reducer', function () {
  it('should return the initial state', function () {
    const state = reducer(undefined, 'bogus');
    assert.deepEqual(state, initialState, 'Did not return initial state.');
  });

  it('should set the error status', function () {
    const fetchError = new Error('error');
    const state = reducer(undefined, {
      type: FETCH_ERROR,
      fetchError,
    });

    assert.equal(state.get('fetchError'), fetchError, 'Error not set');
  });

  it('should set the fetch status', function () {
    const isFetching = true;
    const state = reducer(undefined, {
      type: IS_FETCHING,
      isFetching,
    });

    assert.equal(state.get('isFetching'), isFetching, 'Fetch status not set');
  });

  it('should save a list of images', function () {
    const event = 'wedding';
    const images = ['image1', 'image2'];
    const resultHeader = { foo: 'bar' };
    const state = reducer(undefined, {
      type: RECEIVE_IMAGES,
      event,
      images,
      resultHeader,
    });

    const savedImages = state.getIn(['event', event]);
    assert.deepEqual(savedImages.get('images').toJS(), images, 'Did not save images');
    assert.deepEqual(savedImages.get('resultHeader').toJS(), resultHeader, 'Did not save header info');
  });

  it('should concatenate to a previously saved list of images', function () {
    const event = 'wedding';
    const images1 = ['image1', 'image2'];
    const images2 = ['image3', 'image4'];
    const resultHeader = { foo: 'bar' };
    const state = initialState.mergeIn(['event', event], {
      images: images1,
      resultHeader,
    });

    const newState = reducer(state, {
      type: RECEIVE_IMAGES,
      event,
      images: images2,
      resultHeader,
    });
    const savedImages = newState.getIn(['event', event]);
    assert.deepEqual(savedImages.get('images').toJS(), images1.concat(images2), 'Did not concatenate images');
  });

  it('should not modify images for a different event', function () {
    const event1 = 'wedding';
    const event2 = 'bar-mitsvah';
    const images1 = ['image1', 'image2'];
    const images2 = ['image3', 'image4'];
    const resultHeader1 = { foo: 'bar' };
    const resultHeader2 = { foo: 'baz' };
    const state = initialState.mergeIn(['event', event1], {
      images: images1,
      resultHeader: resultHeader1,
    });

    const newState = reducer(state, {
      type: RECEIVE_IMAGES,
      event: event2,
      images: images2,
      resultHeader: resultHeader2,
    });

    const savedImages1 = newState.getIn(['event', event1]);
    assert.deepEqual(savedImages1.get('images').toJS(), images1, 'Did not preserve images');
    assert.deepEqual(savedImages1.get('resultHeader').toJS(), resultHeader1, 'Did not preserve header info');

    const savedImages2 = newState.getIn(['event', event2]);
    assert.deepEqual(savedImages2.get('images').toJS(), images2, 'Did not save images');
    assert.deepEqual(savedImages2.get('resultHeader').toJS(), resultHeader2, 'Did not save header info');
  });
});
