const statusDisplay = document.querySelector('.game--status');

let gameActive = true;
let currentPlayer = "X";
let gameState = ["", "", "", "", "", "", "", "", ""];

let playerScoreO = 0;
let playerScoreX = 0;

const winningMessage = () => `Player ${currentPlayer} has won!`;
const drawMessage = () => `Game ended in a draw!`;
const currentPlayerTurn = () => `It's ${currentPlayer}'s turn`;

statusDisplay.innerHTML = currentPlayerTurn();

const savedOData = window.localStorage.getItem('player-score-o');
const savedXData = window.localStorage.getItem('player-score-x');

window.localStorage.clear();


if (savedOData != undefined && savedOData != undefined){
    loadScoreData(savedOData, savedXData);
}

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function handleCellPlayed(clickedCell, clickedCellIndex) {
    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.innerHTML = currentPlayer;
}

function handlePlayerChange() {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusDisplay.innerHTML = currentPlayerTurn();
}

function handleResultValidation() {
    let roundWon = false;
    for (let i = 0; i <= 7; i++) {
        const winCondition = winningConditions[i];
        const a = gameState[winCondition[0]];
        const b = gameState[winCondition[1]];
        const c = gameState[winCondition[2]];
        if (a === '' || b === '' || c === '') {
            continue;
        }
        if (a === b && b === c) {
            if (currentPlayer === "X") {
                const scoreBoardX = document.getElementById("player-score-x");
                playerScoreX += 1;
                scoreBoardX.value = playerScoreX;
            } else {
                const scoreBoardO = document.getElementById("player-score-o");
                playerScoreO += 1;
                scoreBoardO.value = playerScoreO;
            }
            
            roundWon = true;
            break;
        }
    }


    if (roundWon) {
        saveScoreData();
        console.log(saveScoreData());
        statusDisplay.innerHTML = winningMessage();
        gameActive = false;
        return;
    }

    const roundDraw = !gameState.includes("");
    if (roundDraw) {
        statusDisplay.innerHTML = drawMessage();
        gameActive = false;
        return;
    }

    handlePlayerChange();
    if (currentPlayer === 'O' && gameActive) {
        // AI player's turn 
        const emptyCells = gameState.reduce((acc, cell, index) => {
            if (cell === '') {
                acc.push(index);
            }
            return acc;
        }, []);
        
        const randomIndex = Math.floor(Math.random() * emptyCells.length);
        const randomCellIndex = emptyCells[randomIndex];
        const randomCell = document.querySelector(`[data-cell-index="${randomCellIndex}"]`);
        handleCellPlayed(randomCell, randomCellIndex);
        handleResultValidation();
    }
}

function handleCellClick(clickedCellEvent) {
    const clickedCell = clickedCellEvent.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-cell-index'));

    if (gameState[clickedCellIndex] !== "" || !gameActive) {
        return;
    }

    handleCellPlayed(clickedCell, clickedCellIndex);
    handleResultValidation();
}

function handleRestartGame() {
    gameActive = true;
    currentPlayer = "X";
    gameState = ["", "", "", "", "", "", "", "", ""];
    statusDisplay.innerHTML = currentPlayerTurn();
    document.querySelectorAll('.cell').forEach(cell => cell.innerHTML = "");
}

function loadScoreData(scoreO, scoreX){
    const scoreBoardO = document.getElementById('player-score-o');
    scoreBoardO.value = scoreO;

    const scoreBoardX = document.getElementById('player-score-x');
    scoreBoardX.value = scoreX;
}

function saveScoreData(){
    const saveDataO = document.getElementById('player-score-o');
    const saveDataX = document.getElementById('player-score-x');
    
    window.localStorage.setItem('player-score-o', saveDataO.value);
    window.localStorage.setItem('player-score-x', saveDataX.value);
}

document.querySelectorAll('.cell').forEach(cell => cell.addEventListener('click', handleCellClick));
document.querySelector('.game--restart').addEventListener('click', handleRestartGame);
