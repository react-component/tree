<div align="center">
  <h1>@rc-component/tree</h1>
  <p><sub><img alt="Ant Design" height="14" src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg" style="vertical-align: -0.125em;" /> Ant Design 生态的一部分。</sub></p>
  <p>🌳 可访问的 React 树形视图基础组件。</p>
</div>

<p align="center"><a href="./README.md">English</a> | 简体中文</p>


<div align="center">

[![NPM version][npm-image]][npm-url] [![npm download][download-image]][download-url] [![build status][github-actions-image]][github-actions-url] [![Codecov][codecov-image]][codecov-url] [![bundle size][bundlephobia-image]][bundlephobia-url] [![dumi][dumi-image]][dumi-url]

</div>

## 特性

- 受控和不受控的扩展、选择、检查、拖放和异步加载。
- 通过 `@rc-component/virtual-list` 虚拟滚动大树。
- 树数据、节点属性和事件负载的 TypeScript 定义。

## 安装

```bash
npm install @rc-component/tree
```

## 使用

```tsx
import Tree from '@rc-component/tree';
import type { DataNode } from '@rc-component/tree';
import '@rc-component/tree/assets/index.css';

const treeData: DataNode[] = [
  {
    key: '0',
    title: 'Documents',
    children: [{ key: '0-0', title: 'Roadmap' }],
  },
];

export default () => (
  <Tree defaultExpandAll treeData={treeData} onSelect={keys => console.log(keys)} />
);
```

## 示例

- 本地文档：运行 `npm start`，并打开终端输出的 dumi 地址。
- 预览版本附加到 Vercel 和 Surge 的拉取请求中。

## API

### Tree 属性

| name | description | type | 默认 |
| --- | --- | --- | --- |
| autoExpandParent | 是否自动展开父树节点 | bool | false |
| checkable | 是否支持勾选 | 布尔/React节点 | false |
| checkedKeys | 控制选中的树节点（设置后defaultCheckedKeys将不起作用）。注意：父节点和子节点是关联的，如果父节点的key存在，则所有子节点都会被检查，反之亦然。当设置checkable和checkStrictly时，它应该是一个对象，其中包含checked数组和halfChecked数组。 | String[]/{checked:Array<String>,halfChecked:Array<String>} | [] |
| checkStrictly | 精确检查节点，父子节点不关联 | bool | false |
| className | 根 dom 节点的附加 css 类 | String | '' |
| defaultCheckedKeys | 默认选中的树节点 | String[] | [] |
| defaultExpandedKeys | expand specific treeNodes | String[] | [] |
| defaultExpandAll | expand all treeNodes | bool | false |
| defaultExpandParent | 初始化时自动展开父树节点 | bool | true |
| defaultSelectedKeys | 默认选择的树节点 | String[] | [] |
| disabled | 是否禁用该树 | bool | false |
| draggable | 是否可以拖动树节点。 （Internet Explorer 8 及更早版本或 Safari 5.1 及更早版本不支持拖动事件。） | 布尔\| ({ 节点 }) => 布尔值 | false |
| expandedKeys | 受控展开特定树节点 | String[] | - |
| filterTreeNode | 根据需要过滤一些树节点。它应该返回 true | 函数（节点） | - |
| icon | 自定义图标。当您传递组件时，其渲染将接收完整的 TreeNode 道具作为组件道具 | 元素/函数（道具） | - |
| loadedKeys | 当 `loadData` 为 true 时标记节点被加载 | String[] | - |
| loadData | 异步加载数据，返回值应该是一个promise | 函数（节点） | - |
| multiple | 是否多选 | bool | false |
| prefixCls | 前缀类 | String | 'rc-树' |
| selectable | 是否可以选择 | bool | true |
| selectedKeys | 控制选中的树节点（设置后，defaultSelectedKeys将不起作用） | String[] | [] |
| showIcon | 是否显示图标 | bool | true |
| showLine | 是否显线 | bool | false |
| treeData | 树节点数据数组。设置后无需手动构造子 TreeNode。（value 在整个数组中应唯一） | array<{ key, title, children, [disabled, selectable] }> | - |
| onCheck | 单击树节点/复选框来触发 | 函数（checkedKeys，e：{检查：bool，checkedNodes，节点，事件，nativeEvent}） | - |
| onExpand | fire on treeNode expand or not | 函数（expandedKeys，{扩展：bool，节点，nativeEvent}） | - |
| onDragEnd | 当触发树的 Dragend 事件时执行 | 函数（{事件，节点}） | - |
| onDragEnter | 当触发树的 Dragenter 事件时执行 | 函数（{事件，节点，expandedKeys}） | - |
| onDragLeave | 当触发树的 Dragleave 事件时执行 | 函数（{事件，节点}） | - |
| onDragOver | 当触发树的 Dragover 事件时执行 | 函数（{事件，节点}） | - |
| onDragStart | 当触发树的 Dragstart 事件时执行 | 函数（{事件，节点}） | - |
| onDrop | 触发树节点放置事件时执行 | function({ event, node, dragNode, dragNodesKeys }) | - |
| onLoad | 当节点加载时触发。如果设置了 `loadedKeys`，则必须处理 `onLoad` 以避免无限循环 | 函数（loadedKeys，{事件，节点}） | - |
| onMouseEnter | 当鼠标进入树节点时调用 | 函数（{事件，节点}） | - |
| onMouseLeave | 当鼠标离开树节点时调用 | 函数（{事件，节点}） | - |
| onRightClick | 选择当前树节点并显示自定义上下文菜单 | 函数（{事件，节点}） | - |
| onSelect | 点击树节点时触发 | function(selectedKeys, e: { selected: bool, selectedNodes, node, event, nativeEvent }) | - |
| switcherIcon | 具体切换器图标。 | ReactNode / (props: TreeNodeAttribute) => ReactNode | - |
| virtual | 当 `false` 时禁用虚拟滚动 | boolean | - |
| allowDrop | 是否允许在节点上放置 | ({ dragNode, dropNode, dropPosition }) => boolean | - |
| dropIndicatorRender | 拖动时要渲染的指示器 | ({ dropPosition, dropLevelOffset, indent: number, prefixCls }) => ReactNode | - |
| direction | 树的显示方向，可能会影响拖动行为 | `ltr` \| `rtl` | - |
| expandAction | 树打开逻辑，可选： false \|  `click` \|  ZXQ代码1QXZ | string \| boolean | `click` |

### TreeNode props

> 注意：如果你有很多TreeNode，比如超过1000个，
> 让父节点默认折叠起来，效果会很明显，速度很快。
> 因为隐藏在 children 中的 TreeNode 不会插入到 DOM 中。

| name | description | type | 默认 |
| --- | --- | --- | --- |
| className | 给treeNode添加一个类 | String | '' |
| checkable | 如果树可检查，则控制节点可检查 | bool | false |
| 风格 | 将样式设置为treeNode | Object | '' |
| disabled | 是否禁用树节点 | bool | false |
| disableCheckbox | 是否禁用树节点的复选框 | bool | false |
| title | 树/子树的标题 | 字符串/元素/((数据：DataNode) => React.ReactNode) | '---' |
| key | 它与树道具的（默认）ExpandedKeys /（默认）CheckedKeys /（默认）SelectedKeys 一起使用。最好设置一下，并且在树的所有treeNodes中必须是唯一的 | String | treeNode's position |
| isLeaf | 是否是叶子节点 | bool | false |
| icon | 自定义图标。当您传递组件时，其渲染将接收完整的 TreeNode 道具作为组件道具 | 元素/函数（道具） | - |
| switcherIcon | 具体切换器图标。 | ReactNode / (props: TreeNodeAttribute) => ReactNode | - |

## Note

树节点的数量可以非常大，但是当启用 `checkable` 时，会花费更多的计算时间，因此我们缓存了一些计算（例如 `this.treeNodesStates`），以避免重复计算。但是，这带来了一些限制，**当你异步加载树节点时，你应该像这样渲染树** `{this.state.treeData.length ? <Tree ...>{this.state.treeData.map(t => <TreeNode ... />)}</Tree> : 'loading tree'}`

## 本地开发

```bash
npm install
npm start
```

在发送拉取请求之前运行检查：

```bash
npm run lint
npm run tsc
npm test -- --runInBand
npm run build
```

## 发布

```bash
npm run prepublishOnly
```

包构建完成后，发布流程由 `@rc-component/np` 通过 `rc-np` 命令处理。
## Ecosystem

该包属于 React Component 组织，并与 Ant Design 一同维护。 上方 Ant Design 标识仅用于说明生态归属；组件本身仍保持框架级、低样式耦合的定位。

## 其他树视图

- [zTree](http://www.treejs.cn/)
- [jqTree](https://mbraak.github.io/jqTree/)
- [jquery.treeselect](https://travistidwell.com/jquery.treeselect.js/)
- [角度多选树](https://a5hik.github.io/angular-multi-select-tree/)

## 许可证

@rc-component/tree 基于 [MIT](./LICENSE.md) 许可证发布。

[npm-image]: https://img.shields.io/npm/v/@rc-component/tree.svg?style=flat-square
[npm-url]: https://npmjs.org/package/@rc-component/tree
[github-actions-image]: https://github.com/react-component/tree/actions/workflows/main.yml/badge.svg
[github-actions-url]: https://github.com/react-component/tree/actions/workflows/main.yml
[codecov-image]: https://img.shields.io/codecov/c/github/react-component/tree/master.svg?style=flat-square
[codecov-url]: https://codecov.io/gh/react-component/tree/branch/master
[download-image]: https://img.shields.io/npm/dm/@rc-component/tree.svg?style=flat-square
[download-url]: https://npmjs.org/package/@rc-component/tree
[bundlephobia-url]: https://bundlephobia.com/result?p=@rc-component/tree
[bundlephobia-image]: https://badgen.net/bundlephobia/minzip/@rc-component/tree
[dumi-url]: https://github.com/umijs/dumi
[dumi-image]: https://img.shields.io/badge/docs%20by-dumi-blue?style=flat-square
