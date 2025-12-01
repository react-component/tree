import React from 'react';
import {render} from '@testing-library/react';
import Tree from '../src';

jest.mock('@rc-component/virtual-list', () => jest.requireActual('@rc-component/virtual-list'));

describe('Tree Virtual', () => {
  it('should display all nodes when for nonvirtual tree', () => {
    const data = [];
    for (let i = 0; i < 99; i += 1) {
      data.push({
        key: i,
        title: i,
      });
    }

    const { container } = render(
      <Tree itemHeight={10} height={100} treeData={data} virtual={false} />,
    );

    expect(
      container.querySelector('.rc-tree-list-holder').querySelectorAll('.rc-tree-treenode'),
    ).toHaveLength(99);
  });

  it('should support scrollWidth parameter and show horizontal scroll', () => {  
    const data = [{key: 1, title: 'title'}];
    const { container } = render(
      <Tree treeData={data} virtual={true} scrollWidth={400} itemHeight={20} height={100} />,
    );
    
    expect(container.querySelector('.rc-tree-list-scrollbar-horizontal')).toBeInTheDocument();
  
    jest.useRealTimers();
  });
});
