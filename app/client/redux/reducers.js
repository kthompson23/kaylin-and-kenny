import { combineReducers } from 'redux';

import { reducer as ImagesReducer } from './domain/Images';

const reducers = combineReducers({
  images: ImagesReducer,
});

export default reducers;
