import React from 'react';
import PropTypes from 'prop-types';

/**
 * This is a wrapper of empty item so that we can use ref in List
 */
class Item extends React.Component {
  static propTypes = {
    children: PropTypes.node,
  };

  render() {
    const { children } = this.props;
    return children;
  }
}

export default Item;
