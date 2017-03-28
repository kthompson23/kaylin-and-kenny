import { Map as ImmMap } from 'immutable';
import { RECEIVE_IMAGES } from './constants';

export const initialState = ImmMap({
  event: ImmMap(),
});

const ImagesReducer = (state = initialState, action) => {
  switch (action.type) {
    case RECEIVE_IMAGES: {
      const eventName = action.event;
      const prevImages = state.getIn(['event', eventName, 'images'], []);
      const images = prevImages.concat(action.images);
      return state.mergeIn(['event', eventName], {
        images,
        resultHeader: action.resultHeader,
      });
    }
    default:
      return state;
  }
};

export default ImagesReducer;
