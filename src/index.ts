import OriginTree from './Tree';
import TreeNode from './TreeNode';

type OriginTreeType = typeof OriginTree;
interface TreeType extends OriginTreeType {
  TreeNode: typeof TreeNode;
}

const Tree = OriginTree as TreeType;
Tree.TreeNode = TreeNode;

export { TreeNode };
export default Tree;
