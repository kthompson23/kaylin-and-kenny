import React from 'react';
import { PropTypes } from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Map as ImmMap } from 'immutable';

import api from '../../api';
import Images from '../components/Images';
import { actions as ImagesActions } from '../../redux/domain/Images';

class ImagesContainer extends React.Component {
  constructor() {
    super();

    // The event has been passed to React via an id called react-event-name
    const eventNameNode = document.getElementById('react-event-name');
    const event = eventNameNode.innerText;
    this.state = {
      event,
      isFetching: false,
    };

    this.cancelSource = api.getCancelTokenSource();
    this.handleScrollEvent = this.handleScrollEvent.bind(this);
    this.scrollUp = this.scrollUp.bind(this);
  }

  componentDidMount() {
    // Infinite image scroll. If the user scrolls to the bottom of the page and there are
    // additional images, go fetch them.
    window.addEventListener('scroll', this.handleScrollEvent);

    // api paging is zero based.
    const page = 0;
    this.loadImages(this.state.event, page);
  }

  componentWillUnmount() {
    this.removeScrollListener();
    // Cancel any ongoing requests.
    api.cancelRequests(this.cancelSource);
  }

  /**
   * Helper to return the last page that was fetched.
   */
  currPage() {
    return this.props.eventData.getIn([this.state.event, 'resultHeader', 'page'], 0);
  }

  /**
   * Helper to retun whether there are more pages available or not.
   */
  hasNext() {
    return this.props.eventData.getIn([this.state.event, 'resultHeader', 'next'], null) !== null;
  }

  /**
   * Given an event name and page number retrieve a paginated list of images.
   * @param {string} event - name of the event
   * @param {number} page - zero based
   */
  loadImages(event, page) {
    const {
      receiveImages,
    } = this.props;

    this.setState({
      isFetching: true,
    });

    api.getImages(this.cancelSource.token, {
      event,
      page,
    })
    .then((response) => {
      if (response.data.next === null) {
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
        isFetching: false,
      });
    })
    .catch((error) => {
      if (api.isCancel(error)) {
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
      if (this.hasNext() && !this.state.isFetching) {
        // if a fetch is already in progress let it finish.
        this.loadImages(this.state.event, this.currPage() + 1);
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
    const currPage = this.currPage() + 1;
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
    const {
      eventData,
    } = this.props;

    const images = eventData.getIn([this.state.event, 'images'], []);
    return (
      <Images
        isFetching={this.state.isFetching}
        images={images}
        onScrollRequest={this.scrollUp}
      />
    );
  }
}

ImagesContainer.propTypes = {
  eventData: PropTypes.instanceOf(ImmMap).isRequired,
  receiveImages: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  const eventData = state.images.get('event');
  return {
    eventData,
  };
};

const mapDispatchToProps = dispatch => (
  bindActionCreators(ImagesActions, dispatch)
);

// connect returns a function that accepts a component
export default connect(mapStateToProps, mapDispatchToProps)(ImagesContainer);
