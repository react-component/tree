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

运行本地 dumi 站点：

```bash
npm install
npm start
```

然后打开 `http://localhost:8000`。

## API

### Tree 属性

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| autoExpandParent | 是否自动展开父树节点 | boolean | false |
| checkable | 是否支持勾选 | boolean \| ReactNode | false |
| checkedKeys | 受控选中的树节点。设置后 `defaultCheckedKeys` 将不起作用。注意：父节点和子节点是关联的；当设置 `checkable` 和 `checkStrictly` 时，应传入包含 `checked` 和 `halfChecked` 数组的对象。 | string[] \| { checked: string[]; halfChecked: string[] } | [] |
| checkStrictly | 精确检查节点，父子节点不关联 | boolean | false |
| className | 根 DOM 节点的附加 CSS 类 | string | '' |
| defaultCheckedKeys | 默认选中的树节点 | string[] | [] |
| defaultExpandedKeys | 默认展开的树节点 | string[] | [] |
| defaultExpandAll | 默认展开所有树节点 | boolean | false |
| defaultExpandParent | 初始化时自动展开父树节点 | bool | true |
| defaultSelectedKeys | 默认选择的树节点 | string[] | [] |
| disabled | 是否禁用该树 | boolean | false |
| draggable | 是否可以拖动树节点。 （Internet Explorer 8 及更早版本或 Safari 5.1 及更早版本不支持拖动事件。） | bool \| ({ node }) => boolean | false |
| expandedKeys | 受控展开特定树节点 | String[] | - |
| filterTreeNode | 按需过滤树节点，返回 `true` 时高亮该节点 | function(node) | - |
| icon | 自定义图标。当您传递组件时，其渲染将接收完整的 TreeNode 道具作为组件道具 | element/Function(props) | - |
| loadedKeys | 当 `loadData` 为 true 时标记节点被加载 | string[] | - |
| loadData | 异步加载数据，返回值应该是 Promise | function(node) | - |
| multiple | 是否多选 | boolean | false |
| prefixCls | 前缀类 | string | 'rc-tree' |
| selectable | 是否可以选择 | boolean | true |
| selectedKeys | 控制选中的树节点（设置后，`defaultSelectedKeys` 将不起作用） | string[] | [] |
| showIcon | 是否显示图标 | boolean | true |
| showLine | 是否显示连接线 | boolean | false |
| treeData | 树节点数据数组。设置后无需手动构造子 TreeNode。（value 在整个数组中应唯一） | array<{key,title,children, [disabled, selectable]}> | - |
| onCheck | 单击树节点/复选框时触发 | function(checkedKeys, e:{checked: boolean, checkedNodes, node, event, nativeEvent}) | - |
| onExpand | 树节点展开或收起时触发 | function(expandedKeys, {expanded: boolean, node, nativeEvent}) | - |
| onDragEnd | 触发树节点拖拽结束事件时执行 | function({event,node}) | - |
| onDragEnter | 触发树节点拖拽进入事件时执行 | function({event,node,expandedKeys}) | - |
| onDragLeave | 触发树节点拖拽离开事件时执行 | function({event,node}) | - |
| onDragOver | 触发树节点拖拽悬停事件时执行 | function({event,node}) | - |
| onDragStart | 触发树节点拖拽开始事件时执行 | function({event,node}) | - |
| onDrop | 触发树节点放置事件时执行 | function({event, node, dragNode, dragNodesKeys}) | - |
| onLoad | 当节点加载时触发。如果设置了 `loadedKeys`，则必须处理 `onLoad` 以避免无限循环 | function(loadedKeys, {event, node}) | - |
| onMouseEnter | 当鼠标进入树节点时调用 | function({event,node}) | - |
| onMouseLeave | 当鼠标离开树节点时调用 | function({event,node}) | - |
| onRightClick | 选择当前树节点并显示自定义上下文菜单 | function({event,node}) | - |
| onSelect | 点击树节点时触发 | function(selectedKeys, e:{selected: boolean, selectedNodes, node, event, nativeEvent}) | - |
| switcherIcon | 具体切换器图标。 | ReactNode / (props: TreeNodeAttribute) => ReactNode | - |
| virtual | 当 `false` 时禁用虚拟滚动 | boolean | - |
| allowDrop | 是否允许在节点上放置 | ({ dragNode, dropNode, dropPosition }) => boolean | - |
| dropIndicatorRender | 拖动时要渲染的指示器 | ({ dropPosition, dropLevelOffset, indent: number, prefixCls }) => ReactNode | - |
| direction | 树的显示方向，可能会影响拖动行为 | `ltr` \| `rtl` | - |
| expandAction | 树打开逻辑，可选：`false` 或 `click` | string \| boolean | `click` |

### TreeNode props

> 注意：如果你有很多 TreeNode，比如超过 1000 个，让父节点默认折叠起来，效果会很明显，速度很快。因为隐藏在 children 中的 TreeNode 不会插入到 DOM 中。

| name | description | type | 默认 |
| --- | --- | --- | --- |
| className | 给 TreeNode 添加一个类 | string | '' |
| checkable | 如果树可勾选，则控制节点是否可勾选 | boolean | false |
| style | 设置 TreeNode 样式 | object | '' |
| disabled | 是否禁用树节点 | boolean | false |
| disableCheckbox | 是否禁用树节点的复选框 | boolean | false |
| title | 树/子树的标题 | String/element/((data: DataNode) => React.ReactNode) | '---' |
| key | 与树的 `(default)ExpandedKeys` / `(default)CheckedKeys` / `(default)SelectedKeys` 一起使用，建议设置，并且在所有 TreeNode 中必须唯一 | string | TreeNode 的位置 |
| isLeaf | 是否是叶子节点 | boolean | false |
| icon | 自定义图标。当您传递组件时，其渲染将接收完整的 TreeNode 道具作为组件道具 | element/Function(props) | - |
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

@rc-component/tree 基于 [MIT](./LICENSE) 许可证发布。

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
