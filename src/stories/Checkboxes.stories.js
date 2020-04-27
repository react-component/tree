import React from 'react';

import Tree from '../Tree';

import './default.css';

export default {
  title: 'Checkboxes',
}

/**
 * Test
 */
export const Basic = () => (
  <>
    <Tree
      checkable
      defaultExpandAll
      treeData={[
        {
          key: '1',
          title: '/Users/Sites/project/',
          children: [
            {
              key: '2',
              title: '/folder',
              children: [
                {
                  key: '3',
                  title: '/file.js',
                },
              ],
            },
            {
              key: '4',
              title: '/folder2',
              children: [
                {
                  key: '5',
                  title: '/file2.js',
                },
              ],
            },
          ],
        },
      ]}
    />
  </>
);


export const checkingIndividual = () => (
  <Tree
    checkable
    defaultExpandAll
    checkStrictly
    treeData={[
      {
        key: '1',
        title: '/Users/Sites/project/',
        children: [
          {
            key: '2',
            title: '/folder',
            children: [
              {
                key: '3',
                title: '/file.js',
              },
            ],
          },
          {
            key: '4',
            title: '/folder2',
            children: [
              {
                key: '5',
                title: '/file2.js',
              },
            ],
          },
        ],
      },
    ]}
  />
);

checkingIndividual.story = {
  parameters: {
    docs: {
      storyDescription: `
Notice how if you click on \`file.js\` the parents don't get checked
        `,
    },
  },
}

export const checkingParents = () => (
  <>
    Example 1:
    <Tree
      checkable
      defaultExpandAll
      treeData={[
        {
          key: '1',
          title: '/Users/Sites/project/',
          children: [
            {
              key: '2',
              title: '/folder',
              children: [
                {
                  key: '3',
                  title: '/file.js',
                },
              ],
            },
          ],
        },
      ]}
    />

    Example 2:
    <Tree
      checkable
      defaultExpandAll
      treeData={[
        {
          key: '1',
          title: '/Users/Sites/project/',
          children: [
            {
              key: '2',
              title: '/folder',
              children: [
                {
                  key: '3',
                  title: '/file.js',
                },
              ],
            },
            {
              key: '4',
              title: '/folder2',
              children: [
                {
                  key: '5',
                  title: '/file2.js',
                },
              ],
            },
          ],
        },
      ]}
    />

  </>
)

checkingParents.story = {
  parameters: {
    docs: {
      storyDescription: `
Notice how if you check \`file.js\` all the parents get checked recursively because all their children are checked.
However in the second example if you check \`file.js\` they only get half checked because \`file2.js\` is unchecked
        `,
    },
  },
}