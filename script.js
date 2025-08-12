const board = document.getElementById('gameBoard');
const statusText = document.getElementById('status');
const resetBtn = document.getElementById('resetBtn');
const modeSelect = document.getElementById('mode');
const scoreX = document.getElementById('scoreX');
const scoreO = document.getElementById('scoreO');

let currentPlayer = 'X';
let gameActive = true;
let gameState = Array(9).fill("");
let scores = { X: 0, O: 0 };
let mode = '2p';

const winningConditions = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

modeSelect.addEventListener('change', () => {
  mode = modeSelect.value;
  resetGame();
});

function createBoard() {
  board.innerHTML = '';
  gameState.forEach((_, index) => {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.dataset.index = index;
    cell.addEventListener('click', handleCellClick);
    board.appendChild(cell);
  });
}

function handleCellClick(e) {
  const cellIndex = e.target.dataset.index;
  if (gameState[cellIndex] !== "" || !gameActive) return;

  gameState[cellIndex] = currentPlayer;
  e.target.textContent = currentPlayer;

  const winnerInfo = checkWinner();
  if (winnerInfo) {
    const [a, b, c] = winnerInfo;
    highlightWinningCells(a, b, c);
    statusText.textContent = `🎉 Player ${currentPlayer} Wins!`;
    scores[currentPlayer]++;
    updateScore();
    gameActive = false;
    return;
  }

  if (!gameState.includes("")) {
    statusText.textContent = "🤝 It's a Draw!";
    gameActive = false;
    return;
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  statusText.textContent = `Player ${currentPlayer}'s Turn`;

  if (mode === 'ai' && currentPlayer === 'O' && gameActive) {
    setTimeout(aiMove, 500);
  }
}

function checkWinner() {
  for (let condition of winningConditions) {
    const [a, b, c] = condition;
    if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
      return [a, b, c];
    }
  }
  return null;
}

function highlightWinningCells(a, b, c) {
  const cells = document.querySelectorAll('.cell');
  cells[a].classList.add('winning');
  cells[b].classList.add('winning');
  cells[c].classList.add('winning');
}

function updateScore() {
  scoreX.textContent = `X: ${scores.X}`;
  scoreO.textContent = `O: ${scores.O}`;
}

function aiMove() {
  let available = gameState.map((v, i) => v === "" ? i : null).filter(v => v !== null);
  if (available.length === 0) return;
  let randomIndex = available[Math.floor(Math.random() * available.length)];
  const cells = document.querySelectorAll('.cell');
  gameState[randomIndex] = 'O';
  cells[randomIndex].textContent = 'O';

  const winnerInfo = checkWinner();
  if (winnerInfo) {
    const [a, b, c] = winnerInfo;
    highlightWinningCells(a, b, c);
    statusText.textContent = `🤖 AI Wins!`;
    scores.O++;
    updateScore();
    gameActive = false;
    return;
  }

  if (!gameState.includes("")) {
    statusText.textContent = "🤝 It's a Draw!";
    gameActive = false;
    return;
  }

  currentPlayer = 'X';
  statusText.textContent = "Player X's Turn";
}

function resetGame() {
  currentPlayer = 'X';
  gameActive = true;
  gameState = Array(9).fill("");
  statusText.textContent = `Player X's Turn`;
  createBoard();
}

resetBtn.addEventListener('click', resetGame);

createBoard();
