import React, { PropTypes } from 'react';

import styles from '../styles.css';

/**
 * Get the file name from an absolute or relative path
 * @param {*} imagePath - absolute path
 * http://stackoverflow.com/questions/423376/how-to-get-the-file-name-from-a-full-path-using-javascript
 */
const getFilename = (imagePath) => {
  if (typeof imagePath === 'string') {
    return imagePath.split('\\').pop().split('/').pop();
  }

  return '';
};

/**
 * If additional images are being fetched, display a progress spinner
 * @param {bool} isFetching
 */
const loadProgressBar = (isFetching) => {
  if (isFetching) {
    return (
      <div className={styles['progress-container']}>
        <div className={styles.progress}>
          <i className="fa fa-spinner fa-pulse fa-2x fa-fw progress" />
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <span />
  );
};

/**
 * Add a scroll up button in a fixed position.
 * @param {bool} isFetching
 * @param {func} onScrollRequest
 */
const loadScrollHelper = (isFetching, onScrollRequest) => {
  if (!isFetching) {
    return (
      <button
        className={styles['scroll-button']}
        onClick={onScrollRequest}
      >
        <i className="fa fa-angle-double-up fa-4x fa-inverse" />
      </button>
    );
  }

  return (
    <span />
  );
};

const Images = ({ images, isFetching, onScrollRequest }) => (
  <div>
    <div className={styles['media-container']}>
      {images.map((link) => {
        const fileName = getFilename(link);
        return (
          <button
            key={fileName}
            className={styles['image-button']}
            onClick={() => window.alert('hi')}
          >
            <img className={styles.media} src={link} alt={fileName} />
          </button>
        );
      },
      )}
    </div>
    {loadScrollHelper(isFetching, onScrollRequest)}
    {loadProgressBar(isFetching)}
  </div>
);

Images.propTypes = {
  isFetching: PropTypes.bool.isRequired,
  images: PropTypes.arrayOf(PropTypes.string).isRequired,
  onScrollRequest: PropTypes.func.isRequired,
};

export default Images;
