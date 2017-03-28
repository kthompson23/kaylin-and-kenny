import { RECEIVE_IMAGES } from './constants';

export const initialState = {};

const ImagesReducer = (state = initialState, action) => {
  switch (action.type) {
    case RECEIVE_IMAGES: {
      const images = action.event in state ? state[action.event].images : [];
      const newEventData = {};
      newEventData[action.event] = {
        images: images.concat(action.images),
        resultHeader: action.resultHeader,
      };

      return Object.assign({}, state, newEventData);
    }
    default:
      return state;
  }
};

export default ImagesReducer;
