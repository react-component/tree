/* eslint-disable no-undef, react/no-multi-comp, react/no-unused-state, react/prop-types, no-return-assign */
import React from 'react';
import Tree from '../src/Tree';
import TreeNode from '../src/TreeNode';
import { convertDataToTree, convertTreeToEntities, conductCheck } from '../src/util';
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

  // You can remove this test if refactor remove conductCheck function
  describe('conductCheck', () => {
    describe('basic', () => {
      const genTree = (props) => (
        <Tree {...props}>
          <TreeNode key="greed" title="GreeIs" />
          <TreeNode key="good" title="good">
            <TreeNode key="there" title="There" />
            <TreeNode key="is" title="Is">
              <TreeNode key="no" title="No" />
              <TreeNode key="spoon" title="Spoon">
                <TreeNode key="i" title="I" />
                <TreeNode key="see" title="See" />
                <TreeNode key="dead" title="Dead">
                  <TreeNode key="people" title="People" />
                  <TreeNode key="!" title="!" />
                </TreeNode>
              </TreeNode>
            </TreeNode>
          </TreeNode>
        </Tree>
      );

      it('check', () => {
        const tree = genTree();
        const { keyEntities } = convertTreeToEntities(tree.props.children);
        const { checkedKeys, halfCheckedKeys } =
          conductCheck(['spoon'], true, keyEntities);
        expect(checkedKeys.sort()).toEqual(['spoon', 'i', 'see', 'dead', 'people', '!'].sort());
        expect(halfCheckedKeys.sort()).toEqual(['good', 'is'].sort());
      });

      it('uncheck', () => {
        const tree = genTree({ checkedKeys: ['greed', 'good'] });
        const { keyEntities } = convertTreeToEntities(tree.props.children);

        // First, we check all
        const allCheckedKeys = conductCheck(['greed', 'good'], true, keyEntities).checkedKeys;
        expect(allCheckedKeys.length).toEqual(11);

        // Then uncheck one of then
        const { checkedKeys, halfCheckedKeys } =
          conductCheck(['spoon'], false, keyEntities, { checkedKeys: allCheckedKeys });
        expect(checkedKeys.sort()).toEqual(['greed', 'there', 'no'].sort());
        expect(halfCheckedKeys.sort()).toEqual(['good', 'is'].sort());
      });
    });

    describe('part disabled', () => {
      const genTree = (props) => (
        <Tree {...props}>
          <TreeNode key="war">
            <TreeNode key="are" />
            <TreeNode key="not">
              <TreeNode key="it" />
              <TreeNode key="used" disabled>
                <TreeNode key="to" />
                <TreeNode key="be" />
              </TreeNode>
            </TreeNode>
          </TreeNode>
        </Tree>
      );

      it('check', () => {
        const tree = genTree();
        const { keyEntities } = convertTreeToEntities(tree.props.children);

        const result1 =
          conductCheck(['not'], true, keyEntities);
        expect(result1.checkedKeys.sort()).toEqual(['not', 'it'].sort());
        expect(result1.halfCheckedKeys.sort()).toEqual(['war'].sort());

        const result2 =
          conductCheck(['to', 'be'], true, keyEntities);
        expect(result2.checkedKeys.sort()).toEqual(['to', 'be'].sort());
        expect(result2.halfCheckedKeys.sort()).toEqual([].sort());
      });

      it('uncheck', () => {
        const tree = genTree();
        const { keyEntities } = convertTreeToEntities(tree.props.children);

        // First, we check all
        const allCheckedKeys = conductCheck(['war', 'to', 'be'], true, keyEntities).checkedKeys;
        expect(allCheckedKeys.length).toEqual(6);

        // Then uncheck one of then
        const result1 =
          conductCheck(['not'], false, keyEntities, { checkedKeys: allCheckedKeys });
        expect(result1.checkedKeys.sort()).toEqual(['are', 'to', 'be'].sort());
        expect(result1.halfCheckedKeys.sort()).toEqual(['war'].sort());

        const result2 =
          conductCheck(['to', 'be'], false, keyEntities, { checkedKeys: allCheckedKeys });
        expect(result2.checkedKeys.sort()).toEqual(['war', 'are', 'not', 'it'].sort());
        expect(result2.halfCheckedKeys.sort()).toEqual([].sort());
      });
    });
  });
});
