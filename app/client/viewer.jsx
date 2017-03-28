import React from 'react';
import { render } from 'react-dom';
import { createStore } from 'redux';

import ImagesContainer from './images';
import reducer from './redux/reducers';

const store = createStore(reducer);

render(
  <ImagesContainer store={store} />,
  document.querySelector('#main'),
);
