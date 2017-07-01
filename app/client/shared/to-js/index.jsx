import React from 'react';
import { Iterable } from 'immutable';

/**
 * Convert any immutable.js structures to plain JS structures; objects and arrays
 * @param {React component} WrappedComponent
 * http://redux.js.org/docs/recipes/UsingImmutableJS.html
 */
const toJS = WrappedComponent => (wrappedComponentProps) => {
  const KEY = 0;
  const VALUE = 1;

  const propsJS = Object.entries(
    wrappedComponentProps,
  ).reduce((newProps, wrappedComponentProp) => {
    // eslint-disable-next-line no-param-reassign
    newProps[wrappedComponentProp[KEY]] = Iterable.isIterable(
      wrappedComponentProp[VALUE],
    )
      ? wrappedComponentProp[VALUE].toJS()
      : wrappedComponentProp[VALUE];
    return newProps;
  }, {});

  return <WrappedComponent {...propsJS} />;
};

export default toJS;
