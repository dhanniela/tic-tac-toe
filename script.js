let currentPlayer = "\u00D7";
let turn = 1;
let gameBoard = [
  ["", "", ""],
  ["", "", ""],
  ["", "", ""]
]

let gameBoardCopy = [
  ["", "", ""],
  ["", "", ""],
  ["", "", ""]
]

let gameHistory = [];
let latestRow = [];
let latestColumn = [];
let latestMove = 0;
let latestIndex = 0;
let winnerFound = false;
let unClickable = false;

const button = document.getElementById("playButton"),
  status = document.getElementById("status"),
  restart = document.getElementById("restart"),
  next = document.getElementById("next"),
  previous = document.getElementById("previous"),
  movesHistory = document.getElementById("movesHistory"),
  board = document.getElementById("board");
  modal = document.querySelector(".modal"),
  gameModal = document.querySelector(".gameModal"),
  historyModal = document.querySelector(".historyModal");

const firstPlayer = (playerChoice) => {
  currentPlayer = playerChoice;

  if(gameModal.style.display === "block"){
    gameModal.style.display = "none";
  }
  else {
    gameModal.style.display = "block";
    modal.style.display = "none";
  }

  status.innerHTML = `Player ${playerChoice} plays first!`;
}

const checkWin = () => {
  for(let row = 0; row < 3; row++){
    if (
      gameBoard[row][0] === currentPlayer &&
      gameBoard[row][1] === currentPlayer &&
      gameBoard[row][2] === currentPlayer
    ){
      return true
    }
  }

  for (let col = 0; col < 3; col++){
    if (
      gameBoard[0][col] === currentPlayer &&
      gameBoard[1][col] === currentPlayer &&
      gameBoard[2][col] === currentPlayer
    ){
      return true
    }
  }

  if (
    gameBoard[0][0] === currentPlayer &&
    gameBoard[1][1] === currentPlayer &&
    gameBoard[2][2] === currentPlayer
  ){
    return true
  }

  if (
    gameBoard[0][2] === currentPlayer &&
    gameBoard[1][1] === currentPlayer &&
    gameBoard[2][0] === currentPlayer
  ){
    return true
  }

  return false
}

const checkDraw = () => {
  if (turn === 9){
    return true;
  }

  turn++;

  return false;
}

const move = (row, col) => {
  if (gameBoard[row][col] === ""){

    //For previous and next functionalities
    latestRow.push(row);
    latestColumn.push(col);
    //Moving index, for going back and forth
    latestIndex++;
    //Static index, indicates latest index
    latestMove++;

    recordHistory(row,col);

    gameBoard[row][col] = currentPlayer;
    gameBoardCopy[row][col] = currentPlayer;

    if(checkWin()){
      status.innerHTML = `Player ${currentPlayer} win!`;
      restart.innerHTML = "New Game";
      winnerFound = true;
      lockUnlockButton();
    } else if (checkDraw()){
      status.innerHTML = "Draw!";
      lockUnlockButton();
    } else{
      currentPlayer = currentPlayer === "\u00D7" ? "o" : "\u00D7";
      status.innerHTML =  `Player ${currentPlayer}'s turn!`
    }

  }
}

const resetGame = () => {
  turn = 1;
  gameBoard = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""]
  ];

  gameBoardCopy = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""]
  ];

  latestRow = [];
  latestColumn = [];
  latestMove = 0;
  latestIndex = 0;
  winnerFound = false;
  unClickable = false;

  lockUnlockButton();

  if(modal.style.display === "block"){
    modal.style.display = "none"
  }
  else {
    modal.style.display = "block";
    gameModal.style.display = "none";
  }

  gameHistory = [];
  movesHistory.innerHTML = "";
  restart.innerHTML = "Restart";
  renderBoard();
}

const renderBoard = () => {
  board.innerHTML = "";

  for (let row = 0; row < 3; row++){
    for (let col = 0; col < 3; col++){
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.innerText = gameBoard[row][col];
      cell.id = `${row}-${col}`;

      cell.addEventListener("click", () => {
        if(!winnerFound && !unClickable){
          move(row, col);
          renderBoard();
        }
      })

      board.appendChild(cell);
    }
  }
}

const showHistory = () =>{
  if(historyModal.style.display === "block"){
    historyModal.style.display = "none"
  }
  else {
    historyModal.style.display = "block";
  }
}

const showNext = () => {
  let displayPlayer = gameBoardCopy[latestRow[latestIndex]][latestColumn[latestIndex]] === "\u00D7" ? "o" : "\u00D7";

  status.innerHTML =  `Player ${displayPlayer}'s turn!`
  
  gameBoard[latestRow[latestIndex]][latestColumn[latestIndex]] = gameBoardCopy[latestRow[latestIndex]][latestColumn[latestIndex]];

  //Lighting effect for history
  let histories = movesHistory.children;

  for(let i = 0; i < histories.length; i++){
    histories[i].style.color = "white";
  }

  histories[latestIndex].style.color = "#f1dac4";


  latestIndex++;
  renderBoard();

  lockUnlockButton();
}

const showPrev = () => {
  // currentPlayer = currentPlayer === "\u00D7" ? "o" : "\u00D7";
  // status.innerHTML =  `Player ${currentPlayer}'s turn!`

  status.innerHTML =  `Player ${gameBoard[latestRow[latestIndex-1]][latestColumn[latestIndex-1]]}'s turn!`

  gameBoard[latestRow[latestIndex-1]][latestColumn[latestIndex-1]] = "";

  //Lighting effect for history
  let histories = movesHistory.children;

  for(let i = 0; i < histories.length; i++){
    histories[i].style.color = "white";
  }

  histories[latestIndex-1].style.color= "#f1dac4";

  console.log(gameBoard);
  console.log(gameBoardCopy);

  latestIndex--;
  renderBoard();

  lockUnlockButton();
}

const recordHistory = (row,col) => {
  gameHistory.push(currentPlayer + " on " + "row: " + row + " col: " + col)

  let li = document.createElement('li');
  li.innerHTML = currentPlayer + " on " + "row: " + row + " col: " + col;
  movesHistory.appendChild(li);
}

const lockUnlockButton = () => {
  if (winnerFound || turn === 9){
    next.style.visibility = "visible";
    previous.style.visibility = "visible";

    if(latestIndex === latestMove){
      //lock next button
      status.innerHTML = winnerFound? `Player ${currentPlayer} won!`: `Draw!`;
      next.style.visibility = "hidden";
      unClickable = true;
    }
    else {
      next.style.visibility = "visible";
    }

    if (latestIndex === 0 ){
      //lock prev button
      previous.style.visibility = "hidden";
      unClickable = true;
    } 
    else {
      //unlock prev button
      previous.style.visibility = "visible";
    }
  }
  else {
      //lock prev and next button
      next.style.visibility = "hidden";
      previous.style.visibility = "hidden";
  }
}

document.addEventListener("DOMContentLoaded", () => {

  next.style.visibility = "hidden";
  previous.style.visibility = "hidden";

  renderBoard()
})

button.onclick = function() {
    if(modal.style.display === "block"){
      modal.style.display = "none"
    }
    else {
      modal.style.display = "block";
    }
}