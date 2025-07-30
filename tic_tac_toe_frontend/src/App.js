import React, { useState, useEffect } from 'react';
import './App.css';

/**
 * PUBLIC_INTERFACE
 * Main App component for the Tic Tac Toe Game.
 * Features:
 * - Interactive 3x3 game board
 * - Modern, minimalistic, centered UI with custom colors
 * - Player turn indicator
 * - Highlight winning moves
 * - Restart button and local score tracking
 */
function App() {
  // State: 0 = empty, 1 = X, 2 = O
  const emptyBoard = Array(9).fill(0);
  const [board, setBoard] = useState(emptyBoard);
  const [xIsNext, setXIsNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [winningLine, setWinningLine] = useState([]);
  const [scores, setScores] = useState({ X: 0, O: 0 });
  const [moveCount, setMoveCount] = useState(0);

  // Color constants
  const COLORS = {
    primary: '#4A90E2',
    secondary: '#50E3C2',
    accent: '#D0021B'
  };

  // Effect: Reset board if player hits restart or after a delay when win/tie
  useEffect(() => {
    if (winner) {
      // Update score only the first time winner is set
      if (winner === 1) setScores(s => ({ ...s, X: s.X + 1 }));
      if (winner === 2) setScores(s => ({ ...s, O: s.O + 1 }));
    }
  }, [winner]);

  // Function: Calculate Winner
  function calculateWinner(squares) {
    // Winning lines
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6]             // diagonals
    ];
    for (let line of lines) {
      const [a, b, c] = line;
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        return { winner: squares[a], line };
      }
    }
    return squares.every(Boolean) ? { winner: 'tie', line: [] } : null;
  }

  // Handler: When user clicks a square
  function handleSquareClick(idx) {
    if (winner || board[idx]) return; // blocked if finish or occupied
    const newBoard = board.slice();
    newBoard[idx] = xIsNext ? 1 : 2;
    setBoard(newBoard);
    setXIsNext(!xIsNext);
    setMoveCount(prev => prev + 1);

    const result = calculateWinner(newBoard);
    if (result) {
      setWinner(result.winner);
      setWinningLine(result.line);
    }
  }

  // Handler: Reset game to new round
  function handleRestart() {
    setBoard(emptyBoard);
    setXIsNext(moveCount % 2 === 0); // Alternate who starts if desired, or always X
    setWinner(null);
    setWinningLine([]);
    setMoveCount(0);
  }

  // Helper: Render Square
  function renderSquare(idx) {
    const value = board[idx];
    let displayChar = '';
    let color = COLORS.primary;

    if (value === 1) {
      displayChar = 'X';
      color = COLORS.primary;
    } else if (value === 2) {
      displayChar = 'O';
      color = COLORS.secondary;
    }

    // Winning line highlighting
    const isWin = winningLine.includes(idx);
    return (
      <button
        className="ttt-square"
        key={idx}
        onClick={() => handleSquareClick(idx)}
        style={{
          color: color,
          background: isWin ? COLORS.accent + '22' : '#fff',
          border: `2px solid ${isWin ? COLORS.accent : '#e7e7e7'}`,
          transition: isWin ? 'background 0.3s' : undefined,
          cursor: value || winner ? 'not-allowed' : 'pointer',
        }}
        aria-label={`Board cell ${idx + 1}${displayChar ? ": " + displayChar : ""}`}
        tabIndex={0}
        disabled={!!value || !!winner}
      >
        {displayChar}
      </button>
    );
  }

  // Helper: Status message
  let statusText = '';
  if (winner === 'tie') {
    statusText = "It's a Tie!";
  } else if (winner === 1) {
    statusText = "Winner: X 🎉";
  } else if (winner === 2) {
    statusText = "Winner: O 🎉";
  } else {
    statusText = `Turn: ${xIsNext ? 'X' : 'O'}`;
  }

  // Styling overrides for inline layout control; most style in App.css below.
  return (
    <div className="ttt-app-bg">
      <div className="ttt-content">
        <h1 className="ttt-title">Tic Tac Toe</h1>
        <div className="ttt-scoreboard">
          <span className="ttt-score" style={{ color: COLORS.primary }}>X: {scores.X}</span>
          <span className="ttt-divider" />
          <span className="ttt-score" style={{ color: COLORS.secondary }}>O: {scores.O}</span>
        </div>
        <div className="ttt-status" aria-live="polite">
          {statusText}
        </div>
        <div className="ttt-board">
          {[0, 1, 2].map(row =>
            <div className="ttt-row" key={row}>
              {[0, 1, 2].map(col => renderSquare(row * 3 + col))}
            </div>
          )}
        </div>
        <button
          className="ttt-btn-restart"
          style={{
            background: COLORS.primary,
            color: '#fff',
            marginTop: '1.7rem',
            outline: 'none',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 600,
          }}
          onClick={handleRestart}
        >
          Restart Game
        </button>
        <footer className="ttt-footer">
          <small>
            <span style={{ color: COLORS.accent }}>❤</span> Modern React Game | Light theme
          </small>
        </footer>
      </div>
    </div>
  );
}

export default App;
