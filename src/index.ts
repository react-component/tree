import OriginTree, { TreeProps } from './Tree';
import TreeNode, { TreeNodeProps } from './TreeNode';

type OriginTreeType = typeof OriginTree;
interface TreeType extends OriginTreeType {
  TreeNode: typeof TreeNode;
}

const Tree = OriginTree as TreeType;
Tree.TreeNode = TreeNode;

export { TreeNode, TreeProps, TreeNodeProps };
export default Tree;
