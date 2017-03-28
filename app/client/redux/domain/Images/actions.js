import {
  RECEIVE_IMAGES,
} from './constants';

const receiveImages = (event, images, resultHeader) => ({
  type: RECEIVE_IMAGES,
  event,
  images,
  resultHeader,
});

export default {
  receiveImages,
};
