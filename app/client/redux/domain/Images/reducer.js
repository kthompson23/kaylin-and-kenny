import { List, fromJS, Map as ImmMap } from 'immutable';
import { FETCH_ERROR, IS_FETCHING, RECEIVE_IMAGES } from './constants';

export const initialState = new ImmMap({
  event: new ImmMap(),
  fetchError: undefined,
  isFetching: false,
});

const ImagesReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_ERROR:
      return state.set('fetchError', action.fetchError);
    case IS_FETCHING:
      return state.set('isFetching', action.isFetching);
    case RECEIVE_IMAGES: {
      const eventName = action.event;
      const prevImages = state.getIn(['event', eventName, 'images'], new List());
      const images = prevImages.concat(fromJS(action.images));
      return state.mergeIn(['event', eventName], {
        images,
        resultHeader: fromJS(action.resultHeader),
      });
    }
    default:
      return state;
  }
};

export default ImagesReducer;
