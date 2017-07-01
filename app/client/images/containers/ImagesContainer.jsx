import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Map as ImmMap } from 'immutable';
import throttle from 'lodash.throttle';

import api from 'api';
import toJS from 'shared/to-js';

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
    };

    this.cancelSource = api.getCancelTokenSource();
    this.handleScrollEvent = this.handleScrollEvent.bind(this);
    this.scrollUp = this.scrollUp.bind(this);
    this.scrollHandler = throttle(this.handleScrollEvent, 300);
  }

  componentDidMount() {
    // Infinite image scroll. If the user scrolls to the bottom of the page and there are
    // additional images, go fetch them.
    window.addEventListener('scroll', this.scrollHandler);

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
    const { eventData } = this.props;
    return eventData[this.state.event] != null ? eventData[this.state.event].resultHeader.page : 0;
  }

  /**
   * Helper to retun whether there are more pages available or not.
   */
  hasNext() {
    const { eventData } = this.props;
    return eventData[this.state.event] != null
      ? eventData[this.state.event].resultHeader.next
      : false;
  }

  /**
   * Given an event name and page number retrieve a paginated list of images.
   * @param {string} event - name of the event
   * @param {number} page - zero based
   */
  loadImages(event, page) {
    const {
      getImages,
    } = this.props;

    try {
      getImages(this.cancelSource.token, event, page);
    } catch (ex) {
      console.log(ex);
    }
  }

  /**
   * Fetch any additional image pages when the user scrolls to the bottom
   * of the page. If they are within 200 pixels initiate a new fetch.
   */
  handleScrollEvent() {
    const pixelsFromBottom
      = (0 + document.body.offsetHeight) - window.pageYOffset - window.innerHeight;

    if (pixelsFromBottom <= 200) {
      if (this.hasNext() && !this.props.isFetching) {
        // if a fetch is already in progress let it finish.
        this.loadImages(this.state.event, this.currPage() + 1);
      }

      if (!this.hasNext()) {
        this.removeScrollListener();
      }
    }
  }

  /**
   * No more paginated list of images available. Remove scroll listener
   * Checking if the user has reached the bottom of the page.
   */
  removeScrollListener() {
    window.removeEventListener('scroll', this.scrollHandler);
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
      isFetching,
    } = this.props;

    const images = eventData[this.state.event] !== undefined
      ? eventData[this.state.event].images
      : [];
    return (
      <Images
        isFetching={isFetching}
        images={images}
        onScrollRequest={this.scrollUp}
      />
    );
  }
}

ImagesContainer.propTypes = {
  eventData: PropTypes.instanceOf(ImmMap).isRequired,
  getImages: PropTypes.func.isRequired,
  isFetching: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => {
  const eventData = state.images.get('event');
  const isFetching = state.images.get('isFetching');
  return {
    eventData,
    isFetching,
  };
};

const mapDispatchToProps = dispatch => (
  bindActionCreators(ImagesActions, dispatch)
);

// connect returns a function that accepts a component
export default connect(mapStateToProps, mapDispatchToProps)(toJS(ImagesContainer));
