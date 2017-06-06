/* eslint-disable func-names, prefer-arrow-callback */
import { assert } from 'chai';
import { spy } from 'sinon';
import axios from 'axios';

import tokenHelpers from './token';

describe('api/token', function () {
  it('should cancel the request with a default message', function () {
    const tokenSource = axios.CancelToken.source();
    const sourceSpy = spy(tokenSource, 'cancel');
    tokenHelpers.cancelRequests(tokenSource);
    assert.isTrue(sourceSpy.calledWith(''), 'Did not call cancel');

    sourceSpy.restore();
  });

  it('should cancel the request with the optional message', function () {
    const tokenSource = axios.CancelToken.source();
    const sourceSpy = spy(tokenSource, 'cancel');
    tokenHelpers.cancelRequests(tokenSource, 'test');
    assert.isTrue(sourceSpy.calledWith('test'), 'Did not call cancel');

    sourceSpy.restore();
  });

  it('should return a token source', function () {
    const tokenSource = tokenHelpers.getCancelTokenSource();
    // this has a token property
    assert.property(tokenSource, 'token', 'Did not return token source');
  });

  it('should check for cancel with passed in error', function () {
    const axiosSpy = spy(axios, 'isCancel');
    const testError = new Error('buh');

    tokenHelpers.isCancel(testError);
    assert.isTrue(axiosSpy.calledWith(testError), 'Did not check if is cancel error');
    axiosSpy.restore();
  });
});
