import React from 'react';
import { render } from 'react-dom';
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';

import ImagesContainer from './images';
import reducers from './redux/reducers';

let preloadedState;

if (process.env.NODE_ENV === 'development') {
  // prepare store for redux dev tools
  // reference: https://github.com/zalmoxisus/redux-devtools-extension#usage
  /* eslint no-underscore-dangle: ["error", { "allow": ["__REDUX_DEVTOOLS_EXTENSION__"] }] */
  preloadedState = window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__();
}

const store = createStore(
  reducers,
  preloadedState,
  applyMiddleware(thunk),
);

render(
  <ImagesContainer store={store} />,
  document.querySelector('#main'),
);
