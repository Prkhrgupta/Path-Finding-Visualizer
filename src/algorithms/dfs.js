// Performs Dijkstra's algorithm; returns *all* nodes in the order
// in which they were visited. Also makes nodes point back to their
// previous node, effectively allowing us to compute the shortest path
// by backtracking from the finish node.
export function dfs(grid, startNode, finishNode) {
  const stack = [startNode];
  const {col: finishCol, row: finishRow} = finishNode;

  const visitedInOrder = [];
  while (stack.length > 0) {
    const curr = stack.pop();
    if (curr.isVisited) continue;
    if(curr.isWall) continue;
    const {col, row} = curr;
    curr.isVisited = true;
    visitedInOrder.push(curr);
    if (col === finishCol && row === finishRow) return visitedInOrder;

    //up
    if (row > 0 && curr.isWall === false) {
      stack.push(grid[row - 1][col]);
    }
    // left
    if (col > 0 && curr.isWall === false) {
      stack.push(grid[row][col - 1]);
    }
    //down
    if (row < 15 && curr.isWall === false) {
      stack.push(grid[row + 1][col]);
    }
    // right
    if (col < 34 && curr.isWall === false) {
      stack.push(grid[row][col + 1]);
    }
  }

  return visitedInOrder;
}
