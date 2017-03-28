import React from 'react';
import axios from 'axios';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Images from '../components/Images';
import { actions as ImagesActions } from '../../redux/domain/Images';

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
    this.scrollUp = this.scrollUp.bind(this);
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
    const {
      receiveImages,
    } = this.props;

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

      receiveImages(
        event,
        response.data.results.images,
        {
          next: response.data.next,
          page,
          totalImages: response.data.totalImages,
          totalPages: response.data.totalPages,
        },
      );

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

  /**
   * Scroll up to either the top of the page or the next "page"
   * based on how many pages of images have been fixed.
   */
  scrollUp() {
    // zero based
    const currPage = this.state.page + 1;
    const currYPos = window.pageYOffset;
    const totalBodyHeight = document.body.offsetHeight;

    if (currYPos === 0) {
      return;
    }

    let scrollToYPos = totalBodyHeight;
    // Based on the number of pages that have been fetched divide up the body
    // into an even number of pixels.
    const scrollParts = Math.floor(totalBodyHeight / currPage);
    while (scrollToYPos >= currYPos) {
      scrollToYPos -= scrollParts;
    }

    // Don't touch the X value.
    window.scroll(window.pageXOffset, scrollToYPos);
  }

  render() {
    return (
      <Images
        isFetching={this.state.isFetching}
        images={this.state.images}
        onScrollRequest={this.scrollUp}
      />
    );
  }
}

const mapStateToProps = (state) => {
  const eventData = state.images;
  return {
    eventData,
  };
};

const mapDispatchToProps = dispatch => (
  bindActionCreators(ImagesActions, dispatch)
);

// connect returns a function that accepts a component
export default connect(mapStateToProps, mapDispatchToProps)(ImagesContainer);
