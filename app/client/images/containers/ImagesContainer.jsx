import React from 'react';
import axios from 'axios';

class ImagesContainer extends React.Component {
  constructor() {
    super();

    this.state = {
      page: 0,
      totalImages: 0,
      totalPages: 0,
      isFetching: 0,
      images: [],
    };
  }

  componentDidMount() {
    const event = 'wedding';
    const page = 0;
    loadImages(event, page);
  }

  loadImages(event, page) {

  }

  render() {
    return (
      <div>
        Sup baby?
</div>
    )
  };
}

export default ImagesContainer;
