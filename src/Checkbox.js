import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

export default class Checkbox extends React.Component {
  static propTypes = {
    prefixCls: PropTypes.string.isRequired,
    eventKey: PropTypes.string.isRequired,
    checkable: PropTypes.bool,
    checkStrictly: PropTypes.bool,
    disabled: PropTypes.bool,
    disableCheckbox: PropTypes.bool,
    onCheck: PropTypes.func.isRequired,
  }

  static contextTypes = {
    store: PropTypes.object.isRequired,
  }

  constructor(props, context) {
    super(props, context);

    this.state = this.getCheckedState();
  }

  componentDidMount() {
    const { store } = this.context;

    this.unsubscribe = store.subscribe(() => {
      this.setCheckState();
    });
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  getCheckedState() {
    const { eventKey, checkStrictly } = this.props;
    const { store } = this.context;
    const { checkedKeys, halfCheckedKeys } = store.getState();

    let checked = false;
    let halfChecked = false;

    checked = checkedKeys.indexOf(eventKey) !== -1;
    if (!checkStrictly) {
      halfChecked = halfCheckedKeys.indexOf(eventKey) !== -1;
    }

    return {
      checked,
      halfChecked,
    };
  }

  setCheckState() {
    const checkState = this.getCheckedState();
    if (checkState.checked !== this.state.checked ||
      checkState.halfChecked !== this.state.halfChecked) {
      this.setState(checkState);
    }
  }

  handleCheck = () => {
    this.props.onCheck(!this.state.checked);
  }

  render() {
    const { checked, halfChecked } = this.state;
    const { prefixCls, checkable, disabled, disableCheckbox } = this.props;
    const className = classnames(`${prefixCls}-checkbox`, {
      [`${prefixCls}-checkbox-checked`]: checked,
      [`${prefixCls}-checkbox-indeterminate`]: halfChecked,
      [`${prefixCls}-checkbox-disabled`]: disabled || disableCheckbox,
    });
    const customEle = typeof checkable !== 'boolean' ? checkable : null;
    const props = { className };
    if (!disabled || !disableCheckbox) {
      props.onClick = this.handleCheck;
    }

    return (
      <span {...props}>
        {customEle}
      </span>
    );
  }
}
