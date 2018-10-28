/* eslint no-console:0 */
/* eslint no-alert:0 */
/* eslint jsx-a11y/no-noninteractive-element-interactions:0 */
import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import Tree from 'rc-tree';
import 'rc-tree/assets/index.less';
import './basic.less';

const treeData = [
  { key: '0-0', title: 'parent 1', children:
    [
      { key: '0-0-0', title: 'parent 1-1', children:
        [
          { key: '0-0-0-0', title: 'parent 1-1-0' },
          { key: '0-0-0-1', title: 'parent 1-1-1' },
          { key: '0-0-0-2', title: 'parent 1-1-2' },
          { key: '0-0-0-3', title: 'parent 1-1-3' },
        ],
      },
      { key: '0-0-1', title: 'parent 1-2', children:
          [
            { key: '0-0-1-0', title: 'parent 1-2-0', disableCheckbox: true },
            { key: '0-0-1-1', title: 'parent 1-2-1' },
          ],
      },
    ],
  },
];

class Demo extends React.Component {
  static propTypes = {
    keys: PropTypes.array,
  };
  static defaultProps = {
    keys: ['0-0-0-0'],
  };
  constructor(props) {
    super(props);
    this.state = {
      
    };
  }
  render() {
    return (
      <div style={{ margin: '0 20px' }}>
        <Tree
          checkable
          selectable={ false }
          defaultExpandAll
          treeData={treeData}
          horizontal
        />
      </div>
    );
  }
}

ReactDOM.render(<Demo />, document.getElementById('__react-content'));
