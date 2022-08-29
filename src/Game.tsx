import { useState, useEffect } from "react";
import Square from "./components/Square";

type Scores = {
  [key: string]: number;
};

const INITIAL_GAME_STATE = ["", "", "", "", "", "", "", "", ""];
const WINNING_COMBINATION = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];
const INITIAL_SCORES: Scores = { X: 0, O: 0 };

function Game() {
  const [gameState, setGameState] = useState(INITIAL_GAME_STATE);
  const [currentPlayer, setCurrentPlayer] = useState("X");
  const [scores, setScores] = useState(INITIAL_SCORES);

  useEffect(() => {
    if (gameState === INITIAL_GAME_STATE) return;
    checkForWinner();
  }, [gameState]);

  useEffect(() => {
    const storedScores = localStorage.getItem("scores");
    if (storedScores) {
      setScores(JSON.parse(storedScores));
    }
  }, []);

  const handleWin = () => {
    window.alert(`Congratulations Player ${currentPlayer}! Your The Winner!`);

    const newPlayerScore = scores[currentPlayer] + 1;
    const newScores = { ...scores };
    newScores[currentPlayer] = newPlayerScore;
    setScores(newScores);
    localStorage.setItem("scores", JSON.stringify(newScores));
    resetGame();
  };

  const handleDraw = () => {
    window.alert(`The Game Has Ended In A Draw!`);
    resetGame();
  };

  const resetGame = () => setGameState(INITIAL_GAME_STATE);

  const restartGame = () => {
    setScores(INITIAL_SCORES);
    localStorage.setItem("scores", JSON.stringify(scores));
    resetGame();
  };

  const checkForWinner = () => {
    let wonRound = false;

    for (let i = 0; i < WINNING_COMBINATION.length; i++) {
      const winningCombo = WINNING_COMBINATION[i];
      let a = gameState[winningCombo[0]];
      let b = gameState[winningCombo[1]];
      let c = gameState[winningCombo[2]];

      if ([a, b, c].includes("")) {
        continue;
      }
      if (a === b && b === c) {
        wonRound = true;
        break;
      }
    }
    if (wonRound) {
      setTimeout(() => handleWin(), 500);
      return;
    }
    if (!gameState.includes("")) {
      setTimeout(() => handleDraw(), 500);
      return;
    }
    changePlayer();
  };

  const changePlayer = () => {
    setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
  };

  console.log(typeof scores);

  const handleSquareClick = (event: any) => {
    const cellIndex = Number(event.target.getAttribute("data-cell-index"));
    const currentValue = gameState[cellIndex];
    if (currentValue) return;

    const newValues = [...gameState];

    newValues[cellIndex] = currentPlayer;
    setGameState(newValues);
  };

  return (
    <div className="w-full h-[100vh] flex justify-center items-center p-6 text-slate-800 bg-gradient-to-r from-cyan-500 to-blue-500">
      <div className="flex flex-col space-y-4 items-center justify-center">
        <div>
          <h1 className="text-center text-5xl mb-4 font-serif text-white">
            Tic Tac Toe
          </h1>
        </div>
        <div>
          <div className="grid grid-cols-3 gap-3 mx-auto w-96">
            {gameState.map((player, index) => (
              <Square
                key={index}
                {...{ index, player }}
                onClick={handleSquareClick}
              />
            ))}
          </div>
        </div>
        <div className="mx-auto flex flex-col justify-center items-center w-96 text-2xl text-white">
          <div className="flex space-x-6">
            <p className="mt-5">
              Current Player:
              {currentPlayer === "X" ? (
                <span className="text-yellow-200">"X"</span>
              ) : (
                <span className="text-fuchsia-300">"O"</span>
              )}
            </p>
            <p className="mt-5">
              Next Player:
              {currentPlayer === "O" ? (
                <span className="text-yellow-200">"X"</span>
              ) : (
                <span className="text-fuchsia-300">"O"</span>
              )}
            </p>
          </div>
          <p className="mt-5">
            Player X Wins: <span>{scores["X"]}</span>
          </p>
          <p className="mt-5">
            Player X Wins: <span>{scores["O"]}</span>
          </p>
        </div>
        <div className="flex">
          <button
            onClick={restartGame}
            className="text-white uppercase font-bold border-[3px] rounded-full p-3 m-2 cursor-pointer hover:scale-105 duration-300"
          >
            Restart Game
          </button>
        </div>
      </div>
    </div>
  );
}

export default Game;
