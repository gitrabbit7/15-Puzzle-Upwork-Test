window.onload = startup;

// function called on load to create the puzzle board and add functionality to the pieces and shuffle button
function startup() {
  setBoard();
  shuffle();
}

var tiles = document.getElementsByClassName("tile");
tiles = [...tiles];
var degree = 3;
var boardSize = degree * degree;
const tilewidth = 70;
var gameState = "";
var initialArray;
var blankIndex = 0; // Variabel to store the location and blank tile
var shuffledArray = []; // Array to store the game state

function setBoard() {
  var board = document.getElementsByClassName('puzzle');
  board[0].style.width = tilewidth * degree + 20 + 'px';
  board[0].style.height = tilewidth * degree + 20 + 'px';
  // Create initialArray
  initialArray = Array.from({length: boardSize - 1}, (_, i) => i + 1); // Initial Game State
  initialArray[boardSize - 1] = 0;
  blankIndex = 0;

  Array(15)
  .fill(0)
  .forEach((v, i) => {
    i < boardSize - 1 ? tiles[i].style.display = 'flex' : tiles[i].style.display = 'none';
  })
}

//add eventListner to all tiles
tiles.forEach((tile, index) => {
  tile.addEventListener("click", () => {
    if (gameState) return;
    checkMoveAbility(index + 1);
  });
});

// Call move function when the arrow keys pressed
document.addEventListener("keydown", function (event) {
  if (event.key === "ArrowLeft" && blankIndex % degree !== 0) {
    checkMoveAbility(shuffledArray[blankIndex - 1]);
  } else if (event.key === "ArrowUp" && blankIndex - degree >= 0) {
    checkMoveAbility(shuffledArray[blankIndex - degree]);
  } else if (
    event.key === "ArrowRight" &&
    blankIndex % degree !== degree - 1
  ) {
    checkMoveAbility(shuffledArray[blankIndex + 1]);
  } else if (event.key === "ArrowDown" && blankIndex + degree < boardSize) {
    checkMoveAbility(shuffledArray[blankIndex + degree]);
  }
});

function shuffle() {
  // Create a shuffledArray to initiate the Game.
  const delta = [-degree, -1, 1, degree];
  shuffledArray = initialArray;
  blankIndex = boardSize - 1;
  Array(1000)
    .fill(0)
    .forEach(() => {
      const x = blankIndex + delta[parseInt(4 * Math.random())];
      if (
        x > 0 &&
        x < boardSize &&
        (parseInt(blankIndex / degree) == parseInt(x / degree) ||
          blankIndex % degree == x % degree)
      ) {
        shuffledArray[blankIndex] = shuffledArray[x];
        shuffledArray[x] = 0;
        blankIndex = x;
      }
    });

  // Rearrange the tiles with shuffledArray
  shuffledArray.map(
    (value, index) => value && moveTile(value, parseInt(index / degree), index % degree)
  );
}

// Funtion to check move ability of tile and move tile if possible
function checkMoveAbility(tileNumber) {
  let currentPos = shuffledArray.indexOf(tileNumber);
  let directDelta = 0;
  directDelta = parseInt(currentPos / degree) == parseInt(blankIndex / degree) ? 1 : 0;
  if(!directDelta) directDelta = parseInt(currentPos % degree) == parseInt(blankIndex % degree) ? degree : 0;

  if(directDelta) {
    const dist = Math.abs(blankIndex - currentPos)
    const direction = (blankIndex - currentPos) / dist;
    Array(dist / directDelta)
    .fill(0)
    .forEach(() => {
      currentPos = blankIndex - direction * directDelta;
      shuffledArray[blankIndex] = shuffledArray[currentPos];
      moveTile(shuffledArray[currentPos], parseInt(blankIndex / degree), blankIndex % degree);
      shuffledArray[currentPos] = 0;
      blankIndex = currentPos;
    })
  }
}

function moveTile(tileNumber, row, col) {
  tiles[tileNumber - 1].style.left = col * tilewidth + 10 + "px";
  tiles[tileNumber - 1].style.top = row * tilewidth + 10 + "px";

  setTimeout(checkWin, 100);
}

function checkWin() {
  if (shuffledArray.findIndex((v, i) => v != (i + 1) % boardSize) == -1) {
    alert("win");
    gameState = "win";
  }
}

function selectDegree(selectedObject) {
  degree = parseInt(selectedObject.value);
  boardSize = degree * degree;
  setBoard();
  shuffle();
  gameState = '';
}
