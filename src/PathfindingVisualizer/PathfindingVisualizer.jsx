import React, {Component} from 'react';
import Node from './Node/Node';
import {dijkstra, getNodesInShortestPathOrder} from '../algorithms/dijkstra';
import {bfs, getNodesInPathOrder} from '../algorithms/bfs';
import {dfs} from '../algorithms/dfs';
import {AppBar, Typography, Box, Toolbar} from '@material-ui/core';
import SwapCallsIcon from '@material-ui/icons/SwapCalls';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';

import './PathfindingVisualizer.css';

const START_NODE_ROW = Math.floor(Math.random() * (10 - 5)) + 5;
const START_NODE_COL = Math.floor(Math.random() * (17 - 5)) + 5;
const FINISH_NODE_ROW = Math.floor(Math.random() * (10 - 5)) + 5;
const FINISH_NODE_COL = Math.floor(Math.random() * (27 - 19)) + 19;

export default class PathfindingVisualizer extends Component {
  constructor() {
    super();
    this.state = {
      grid: [],
      mouseIsPressed: false,
      heading: 'Click and Drag to make Wall on the Grid !!',
    };
  }
  // const [heading, changeHeading] = useState("Click and Drag to Draw Walls !! ");

  componentDidMount() {
    const grid = getInitialGrid();
    this.setState({grid});
  }

  handleMouseDown(row, col) {
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({grid: newGrid, mouseIsPressed: true});
  }

  handleMouseEnter(row, col) {
    if (!this.state.mouseIsPressed) return;
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({grid: newGrid});
  }

  handleMouseUp() {
    this.setState({mouseIsPressed: false});
  }

  animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-visited';
      }, 10 * i);
    }
  }

  animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-shortest-path';
      }, 50 * i);
    }
  }

  visualizeDijkstra() {
    this.setState({
      heading: 'Dijkstra Algorithm always guarantee the Shortest Path !!',
    });
    const {grid} = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  visualizeBfs() {
    this.setState({
      heading:
        'Breath-first Search is unweighted and guarantees the shortest path!',
    });
    const {grid} = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    const visitedNodesInOrder = bfs(grid, startNode, finishNode);
    const nodesInPathOrder = getNodesInShortestPathOrder(finishNode);
    this.animateDijkstra(visitedNodesInOrder, nodesInPathOrder);
  }

  visualizeDfs() {
    this.setState({
      heading: 'Depth-first Search does not guarantee the shortest path!',
    });
    const {grid} = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    const visitedNodesInOrder = dfs(grid, startNode, finishNode);
    this.animateDijkstra(visitedNodesInOrder, visitedNodesInOrder);
  }

  render() {
    const {grid, mouseIsPressed} = this.state;

    return (
      <>
        <AppBar position="static">
          <Toolbar>
            {/* <GrainIcon /> */}
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="logo"
              sx={{mr: 2}}>
              <SwapCallsIcon fontSize="large" />
            </IconButton>
            <Typography variant="h6" className={{flexGrow: 1}}>
              Path Finding Visualizer
            </Typography>

            <Box
              m={1}
              display="flex"
              justifyContent="space-between"
              margin="auto"
              sx={{mr: 3}}>
              <Button
                variant="contained"
                color="primary"
                sx={{height: 40}}
                onClick={() => this.visualizeDijkstra()}>
                Dijkstra's Algorithm
              </Button>
            </Box>

            <Box
              m={1}
              display="flex"
              justifyContent="space-between"
              // margin='auto'
              sx={{mr: 4}}>
              <Button
                variant="contained"
                color="primary"
                sx={{height: 40}}
                onClick={() => this.visualizeDfs()}>
                Depth First Search
              </Button>
            </Box>

            <Box
              m={1}
              display="flex"
              justifyContent="space-between"
              // margin='auto'
              sx={{mr: 5}}>
              <Button
                variant="contained"
                color="primary"
                sx={{height: 40}}
                onClick={() => this.visualizeBfs()}>
                Breath First Search
              </Button>
            </Box>
          </Toolbar>
        </AppBar>
        <div>
          <h3> {this.state.heading} </h3>
        </div>

        <div className="grid">
          {grid.map((row, rowIdx) => {
            return (
              <div key={rowIdx}>
                {row.map((node, nodeIdx) => {
                  const {row, col, isFinish, isStart, isWall} = node;
                  return (
                    <Node
                      key={nodeIdx}
                      col={col}
                      isFinish={isFinish}
                      isStart={isStart}
                      isWall={isWall}
                      mouseIsPressed={mouseIsPressed}
                      onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                      onMouseEnter={(row, col) =>
                        this.handleMouseEnter(row, col)
                      }
                      onMouseUp={() => this.handleMouseUp()}
                      row={row}></Node>
                  );
                })}
              </div>
            );
          })}
        </div>
      </>
    );
  }
}

const getInitialGrid = () => {
  const grid = [];
  for (let row = 0; row < 16; row++) {
    const currentRow = [];
    for (let col = 0; col < 35; col++) {
      currentRow.push(createNode(col, row));
    }
    grid.push(currentRow);
  }
  return grid;
};

const createNode = (col, row) => {
  return {
    col,
    row,
    isStart: row === START_NODE_ROW && col === START_NODE_COL,
    isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
    distance: Infinity,
    isVisited: false,
    isWall: false,
    previousNode: null,
  };
};

const getNewGridWithWallToggled = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isWall: !node.isWall,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};
