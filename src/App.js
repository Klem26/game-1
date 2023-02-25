import React, { useState, useEffect } from "react";
import "./App.css";

const BOARD_SIZE = 10;
const CELL_STATES = {
  HIDDEN: 0,
  OPEN: 1,
  WITH_NUMBER: 2,
  WITH_HOLE: 3,
};

const generateRandomHoles = () => {
  const holes = [];

  for (let i = 0; i < BOARD_SIZE; i++) {
    const row = [];
    for (let j = 0; j < BOARD_SIZE; j++) {
      const hasHole = Math.random() < 0.2;

      row.push(hasHole);
    }
    holes.push(row);
  }
  return holes;
};

const countNearbyHoles = (holes, row, col) => {
  let count = 0;
  for (let i = row - 1; i <= row + 1; i++) {
    for (let j = col - 1; j <= col + 1; j++) {
      if (
        i >= 0 &&
        i < BOARD_SIZE &&
        j >= 0 &&
        j < BOARD_SIZE &&
        !(i === row && j === col) &&
        holes[i][j]
      ) {
        count++;
      }
    }
  }
  return count;
};

export default function App() {
  const [board, setBoard] = useState([]);
  const [holes, setHoles] = useState([]);
  console.log("board", board);
  console.log("holes", holes);
  useEffect(() => {
    setHoles(generateRandomHoles());
  }, []);

  useEffect(() => {
    const newBoard = [];
    for (let i = 0; i < BOARD_SIZE; i++) {
      const row = [];
      for (let j = 0; j < BOARD_SIZE; j++) {
        const cellState = CELL_STATES.HIDDEN;

        row.push(cellState);
      }
      newBoard.push(row);
    }
    setBoard(newBoard);
  }, [holes]);

  const handleCellClick = (row, col) => {
    if (holes[row][col]) {
      const newBoard = [...board];
      newBoard[row][col] = CELL_STATES.WITH_HOLE;
      setBoard(newBoard);
      return;
    }

    const nearbyHolesCount = countNearbyHoles(holes, row, col);
    if (nearbyHolesCount === 0) {
      const newBoard = [...board];
      newBoard[row][col] = CELL_STATES.OPEN;
      setBoard(newBoard);

      for (let i = row - 1; i <= row + 1; i++) {
        for (let j = col - 1; j <= col + 1; j++) {
          if (
            i >= 0 &&
            i < BOARD_SIZE &&
            j >= 0 &&
            j < BOARD_SIZE &&
            !(i === row && j === col) &&
            board[i][j] === CELL_STATES.HIDDEN
          ) {
            handleCellClick(i, j);
          }
        }
      }
    } else {
      const newBoard = [...board];
      newBoard[row][col] = CELL_STATES.WITH_NUMBER; // змінюємо стан комірки на "з числом"
      setBoard(newBoard);
    }
  };
  const getCellClass = (cellState) => {
    switch (cellState) {
      case CELL_STATES.HIDDEN:
        return "hidden";
      case CELL_STATES.OPEN:
        return "open";
      case CELL_STATES.WITH_NUMBER:
        return "with-number";
      case CELL_STATES.WITH_HOLE:
        return "with-hole";
      default:
        return "";
    }
  };

  return (
    <>
      <div className="container">
        <h1 className="title">Minesweeper</h1>
        <div className="board">
          {board.map((row, rowIndex) => (
            <div key={rowIndex} className="row">
              {row.map((cellState, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`cell ${getCellClass(cellState)}`}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                >
                  {cellState === CELL_STATES.WITH_NUMBER &&
                    countNearbyHoles(holes, rowIndex, colIndex)}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
