/* eslint-disable func-names, prefer-arrow-callback */
import { assert } from 'chai';
import moxios from 'moxios';

import api from 'api';

describe('api/images', function () {
  let tokenSource;

  beforeEach(function () {
    moxios.install();
    tokenSource = api.getCancelTokenSource();
  });

  afterEach(function () {
    moxios.uninstall();
  });

  describe('getImages', function () {
    it('should throw on missing event', function () {
      assert.throws(
        (function () { api.getImages(tokenSource.token); }),
        new RegExp('.*event.*', 'i'),
        'Did not throw on missing event',
      );
    });

    it('should return a promise', function (done) {
      moxios.wait(function () {
        const request = moxios.requests.mostRecent();
        request.respondWith({
          status: 200,
        });
        done();
      });

      assert.typeOf(api.getImages(tokenSource.token, 'event'), 'promise', 'Did not return a promise');
    });
  });
});
