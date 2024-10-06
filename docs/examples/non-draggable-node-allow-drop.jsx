/* eslint-disable no-console, react/no-access-state-in-setstate */
import React from 'react';
import { gData } from './utils/dataUtil';
import './draggable.less';
import '../../assets/index.less';
import Tree from 'rc-tree';

function allowDrop({ dropNode, dropPosition }) {
    if (!dropNode.children) {
        if (dropPosition === 0) return false;
    }
    return true;
}

const defaultData = [...gData, { title: 'non-draggable-title', key:'non-draggable-key'}]

class Demo extends React.Component {
    state = {
        gData: defaultData,
        autoExpandParent: true,
        expandedKeys: [],
    };

    onDragStart = info => {
        console.log('start', info);
    };


    onDrop = info => {
        console.log(info);
        const dropKey = info.node.key;
        const dragKey = info.dragNode.key;
        const dropPos = info.node.pos.split("-");
        const dropPosition =
            info.dropPosition - Number(dropPos[dropPos.length - 1]);

        const loop = (data, key, callback) => {
            for (let i = 0; i < data.length; i++) {
                if (data[i].key === key) {
                    return callback(data[i], i, data);
                }
                if (data[i].children) {
                    loop(data[i].children, key, callback);
                }
            }
        };
        const data = [...this.state.gData];

        // Find dragObject
        let dragObj;
        loop(data, dragKey, (item, index, arr) => {
            arr.splice(index, 1);
            dragObj = item;
        });

        if (!info.dropToGap) {
            // Drop on the content
            loop(data, dropKey, (item) => {
                item.children = item.children || [];
                item.children.unshift(dragObj);
            });
        } else if (
            ((info.node).props.children || []).length > 0 && // Has children
            (info.node).props.expanded && // Is expanded
            dropPosition === 1 // On the bottom gap
        ) {
            loop(data, dropKey, (item) => {
                item.children = item.children || [];
                item.children.unshift(dragObj);
            });
        } else {
            let ar = [];
            let i;
            loop(data, dropKey, (_item, index, arr) => {
                ar = arr;
                i = index;
            });
            if (dropPosition === -1) {
                ar.splice(i, 0, dragObj);
            } else {
                ar.splice(i + 1, 0, dragObj);
            }
        }
        this.setState({
            gData: data,
        });
    };

    onDragEnter = (info) => {
        console.log('dragEnter', info);
        // expandedKeys 需要受控时设置
        // setExpandedKeys(info.expandedKeys)
    };

    render() {
        return (
            <div className="draggable-demo">
                <h2>non-draggable-node-allow-drop</h2>
                <p>When a node is not draggable,but it can be drop</p>
                <div className="draggable-container">
                    <Tree
                        className="draggable-tree"
                        defaultExpandedKeys={this.state.expandedKeys}
                        draggable={{
                            nodeDraggable: function (node) {
                                return node.key !== "non-draggable-key";
                            }
                        }}
                        blockNode
                        onDragEnter={this.onDragEnter}
                        onDrop={this.onDrop}
                        treeData={this.state.gData}
                    />
                </div>
            </div>
        );
    }
}

export default Demo;
