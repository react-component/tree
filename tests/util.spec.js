/* eslint-disable no-undef, react/no-multi-comp, react/no-unused-state, react/prop-types, no-return-assign */
import React from 'react';
import Tree from '../src/Tree';
import TreeNode from '../src/TreeNode';
import { convertDataToTree } from '../src/util';
import { convertTreeToData } from './util';

describe('Util', () => {
  it('convertTreeToData', () => {
    const tree = (
      <Tree>
        <TreeNode key="bamboo" title="Bamboo" />
        <TreeNode key="is" title="Is">
          <TreeNode key="the" title="The" />
          <TreeNode key="best" title="Best" />
          <TreeNode key="plant" title="Plant">
            <TreeNode key="in" title="In" />
            <TreeNode key="our" title="Our" />
            <TreeNode key="world" title="World" />
          </TreeNode>
        </TreeNode>
        <TreeNode key="!" really />
      </Tree>
    );

    const treeData = convertTreeToData(tree.props.children);
    expect(treeData).toEqual([
      { key: 'bamboo', title: 'Bamboo' },
      { key: 'is', title: 'Is', children:
          [
            { key: 'the', title: 'The' },
            { key: 'best', title: 'Best' },
            { key: 'plant', title: 'Plant', children:
                [
                  { key: 'in', title: 'In' },
                  { key: 'our', title: 'Our' },
                  { key: 'world', title: 'World' },
                ]
            },
          ],
      },
      { key: '!', title: '---', really: true },
    ]);
  });

  it('convertTreeToData', () => {
    const treeData = [
      { key: 'rc', title: 'RC' },
      { key: 'tree', title: 'Tree', children:
          [
            { key: 'can', title: 'Can', children:
                [
                  { key: 'do', title: 'Do' },
                  { key: 'the', title: 'The' },
                  { key: 'filter', title: 'Filter', yes: 'no' },
                ]
            },
          ]
      },
    ];

    const $treeNode = convertDataToTree(treeData);

    expect(convertTreeToData($treeNode)).toEqual(treeData);
  });
});
