import React from 'react';
import axios from 'axios';

import Images from '../components/Images';
import styles from '../styles.css';

class ImagesContainer extends React.Component {
  constructor() {
    super();

    this.state = {
      event: '',
      isFetching: false,
      images: [],
      hasNext: false,
      page: 0,
      totalImages: 0,
      totalPages: 0,
    };

    this.cancelSource = axios.CancelToken.source();
    this.handleScrollEvent = this.handleScrollEvent.bind(this);
  }

  componentDidMount() {
    // Infinite image scroll. If the user scrolls to the bottom of the page and there are
    // additional images, go fetch them.
    window.addEventListener('scroll', this.handleScrollEvent);

    // The event has been passed to React via an id called react-event-name
    const eventNameNode = document.getElementById('react-event-name');
    const event = eventNameNode.innerText;
    // api paging is zero based.
    const page = 0;
    this.loadImages(event, page);
  }

  componentWillUnmount() {
    this.removeScrollListener();
    // Cancel any ongoing requests.
    this.cancelSource.cancel();
  }

  /**
   * Given an event name and page number retrieve a paginated list of images.
   * @param {string} event - name of the event
   * @param {int} page - zero based
   */
  loadImages(event, page) {
    this.setState({
      isFetching: true,
    });

    const request = axios.create({
      baseURL: 'http://rhea:5000/api/v1.0/',
      timeout: 5000,
      headers: { Accept: 'application/json' },
    });

    request.get(`images?event=${event}&page=${page}`, {
      cancelToken: this.cancelSource.token,
    })
    .then((response) => {
      let hasNext = false;
      if (response.data.next !== null) {
        hasNext = true;
      } else {
        this.removeScrollListener();
      }

      this.setState({
        event,
        images: this.state.images.concat(response.data.results.images),
        isFetching: false,
        hasNext,
        page,
        totalImages: response.data.totalImages,
        totalPages: response.data.totalPages,
      });
    })
    .catch((error) => {
      if (axios.isCancel(error)) {
        // User has navigated off the page while a request was in progress.
        return;
      }
      console.log(error);
    });
  }

  /**
   * Fetch any additional image pages when the user scrolls to the bottom
   * of the page.
   */
  handleScrollEvent() {
    if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight) {
      if (this.state.hasNext && !this.state.isFetching) {
        // if a fetch is already in progress let it finish.
        this.loadImages(this.state.event, this.state.page + 1);
      }
    }
  }

  /**
   * No more paginated list of images available. Remove scroll listener
   * Checking if the user has reached the bottom of the page.
   */
  removeScrollListener() {
    window.removeEventListener('scroll', this.handleScrollEvent);
  }

  render() {
    return (
      <Images
        isFetching={this.state.isFetching}
        images={this.state.images}
      />
    );
  }
}

export default ImagesContainer;
