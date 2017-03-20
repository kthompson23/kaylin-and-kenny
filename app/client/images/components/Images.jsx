import React, { PropTypes } from 'react';

import styles from '../styles.css';

/**
 * Get the file name from an absolute or relative path
 * @param {*} imagePath - absolute path
 * http://stackoverflow.com/questions/423376/how-to-get-the-file-name-from-a-full-path-using-javascript
 */
const getFilename = imagePath => imagePath.split('\\').pop().split('/').pop();

const Images = ({ images, isFetching }) => (
  <div>
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
);

Images.propTypes = {
  isFetching: PropTypes.bool.isRequired,
  images: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default Images;
