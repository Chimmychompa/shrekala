//number of tokens in a circle
var board =
[
  [4, 4, 4, 4, 4, 4],
  [4, 4, 4, 4, 4, 4]
];
//number of tokens in a scoring container
var scores = [0, 0];

//deals with changing the turns
var turn = 1;

//deals with the ui, making sure the player knows if it's his/her turn
function displayTurn(){
  displayMessage("It is Player " + (turn + 1) +"'s turn");

}

//deals with ui in general, just displays a message
function displayMessage(message){
  document.getElementById('ui').innerHTML = message;
}

//spawns tokens in the circle at random locations (given parameters)
function populateCircle(tokenNumber, row, column){

  var circleElement = document.getElementById("row-"+ row + "-" + column);
  circleElement.innerHTML = "";
  var number = document.createElement('div');
  number.classList.add("number");
  number.innerHTML = tokenNumber;


  var ranX;
  var ranY;

  for(var i = 0; i < tokenNumber;i++){
     var token = document.createElement('div');
     token.classList.add("token");
     ranX = Math.floor(Math.random() * 50) + 3;
     ranY = Math.floor(Math.random() * 50) + 3;
     token.style.left = ranX + "px";
     token.style.top =  ranY + "px";
     circleElement.appendChild(token);

  }
     circleElement.appendChild(number);
}
  //spawns tokens in the score location in random locations(with parameters)
  function populateScore(tokenNumber, row){

    var scoreElement = document.getElementById("row-"+ row + "-score");
    scoreElement.innerHTML = "";
    var scoreNumber = document.createElement('div');
    scoreNumber.classList.add("scoreNumber");
    scoreNumber.innerHTML = tokenNumber;
    var ranX;
    var ranY;

    for(var i = 0; i < tokenNumber;i++){
       var token = document.createElement('div');
       token.classList.add("token");
       ranX = Math.floor(Math.random() * 50) + 3;
       ranY = Math.floor(Math.random() * 150) + 3;
       token.style.left = ranX + "px";
       token.style.top =  ranY + "px";
       scoreElement.appendChild(token);

    }
     scoreElement.appendChild(scoreNumber);

  }
//calls the poplulate functions for circles and scores
function populateBoard(){
  for(var i =0; i < 6; i++){
    for(var j =0; j < 2; j++){
      populateCircle(board[j][i],j,i);
    }
  }
  populateScore(scores[0], 0);
  populateScore(scores[1], 1);

}

//plays a video if either player attempts to make an illegal move
function illegalMove(){
  var help = document.createElement('iframe');
  var helpstart = document.getElementById('helpStart');
  var text = document.getElementById('ui');
  text.innerHTML = 'That is a forbidden move! Please do not do that...';
  helpStart.innerHTML = '';
  help.classList.add('help');
  help.allow = "autoplay; encrypted-media";
  help.src = "https://www.youtube.com/embed/l60MnDJklnM?autoplay=1&rel=0";
  helpstart.appendChild(help);
  setTimeout(illegalMoveRemove, 5000);
}

//removes the video after 5 seconds of starting it
function illegalMoveRemove(){
  var helpstart = document.getElementById('helpStart');
  helpstart.innerHTML= '';
  displayTurn();
}

//takes in the circle which was clicked and process the series of game events
//that should follow
function processMove(row, col){
  if(row != turn){
    illegalMove();
  }else  if(!(board[row][col])){
    illegalMove();
  }else{
    var tokensLeft = board[row][col];
    var newRow = row;
    var newCol = col;
    board[row][col] = 0;
    populateCircle(board[row][col],row, col)
    //for upper player
    if(turn === 0){
      while(tokensLeft > 0){
        if(newRow === 0 && newCol === 0 && tokensLeft >= 1 ){
          newRow = 1;
          scores[0] = scores[0]+1;
          populateScore(scores[0],0);
          if(tokensLeft ===1){
            checkGameOver();
            return;
          }else{
            tokensLeft--;
          }
        }else if(newRow === 1 && newCol === 5 && tokensLeft >= 1 ){
          newRow = 0;
        }else{
          if(newRow === 0){
            newCol--;
          }else{
            newCol++;
          }
        }
        board[newRow][newCol]++;
        populateCircle(board[newRow][newCol],newRow, newCol);
        //if you land in an empty spot you can take the tokens on the opposite row
        if(board[0][newCol] === 1 && turn === newRow && board[1][newCol] && tokensLeft===1){
          scores[0] += 1;
          scores[0] += board[1][newCol];
          board[1][newCol] = 0;
          populateCircle(0,1,newCol);
          board[0][newCol] = 0;
          populateCircle(0,0,newCol);
          populateScore(scores[0],0)
        }
        checkGameOver();
        tokensLeft--;
      }
      //for lower player
    }else{
      while(tokensLeft > 0){
        if(newRow === 1 && newCol === 5 && tokensLeft >= 1 ){
          newRow = 0;
          scores[1] = scores[1]+1;
          populateScore(scores[1],1);
          if(tokensLeft ===1){
            checkGameOver();
            return;
          }else{
            tokensLeft--;
          }
        }else if(newRow === 0 && newCol === 0 && tokensLeft >= 1 ){
          newRow = 1;
        }else{
          if(newRow === 0){
            newCol--;
          }else{
            newCol++;
          }
        }
          board[newRow][newCol]++;
          populateCircle(board[newRow][newCol],newRow, newCol);
          //if you land in an empty spot you can take the tokens on the opposite row
          if(board[1][newCol] === 1 && turn === newRow && board[0][newCol] && tokensLeft===1){
            scores[1] += 1;
            scores[1] += board[0][newCol];
            board[1][newCol] = 0;
            populateCircle(0,1,newCol);
            board[0][newCol] = 0;
            populateCircle(0,0,newCol);
            populateScore(scores[1],1)
          }
          checkGameOver();
          tokensLeft--;
      }
    }
    turn = (turn + 1)%2;
    displayTurn();

  }

}

//checks for the win condition ie one whole row is empty
function checkGameOver(){
  //doesnt matter whose turn it is
    //if top side is all empty
    if(board[0][0] === 0 && board[0][1] === 0 && board[0][2] === 0 && board[0][3] === 0 && board[0][4] === 0 && board[0][5] === 0){
      //then give all of bottom tokens to player 2
      var subtotal = 0;
      for(var i =0; i<6;i++){
        subtotal += board[1][i];
        board[1][i] = 0;
        populateCircle(0,1,i);
      }
      scores[1] += subtotal;
      populateScore(scores[1],1);
      endGame();
      //else if bottom side is all  empty
    }else if(board[1][0] === 0 && board[1][1] === 0 && board[1][2] === 0 && board[1][3] === 0 && board[1][4] === 0 && board[1][5] === 0){
      //then give all of top side tokens to player one
      var subtotal2 = 0;
      for(var i =0; i<6;i++){
        subtotal2 += board[0][i];
        board[0][i] = 0;
        populateCircle(0,0,i);
      }
      scores[0] += subtotal2;
      populateScore(scores[0],0);
      endGame();
    }

}

//displays on screen who won the game (if anybody) also offers a rematch
function endGame(){
  var text = document.getElementById('ui');

  if(scores[0] > scores[1]){
    text.innerHTML = "Player 1 Wins!";
  }else if(scores[1] > scores[0]){
    text.innerHTML = "Player 2 Wins!";
  }else{
    text.innerHTML = "It is a draw!";
  }


  //handling the rematch
  var rematch = document.createElement('div');
  rematch.classList.add('rematch');
  rematch.innerHTML = "Click here if you would like a rematch";

  document.getElementById('restart').addEventListener('click', function(event){
    event.preventDefault();
    restart();
  });
  document.getElementById('restart').appendChild(rematch);

}
//sets all values back to starting postitions and then redraws the board
function restart(){

  document.getElementById('restart').innerHTML = '';
  scores[0] = 0;
  scores[1] = 0;
  board[0][0] = 4;
  board[0][1] = 4;
  board[0][2] = 4;
  board[0][3] = 4;
  board[0][4] = 4;
  board[0][5] = 4;
  board[1][0] = 4;
  board[1][1] = 4;
  board[1][2] = 4;
  board[1][3] = 4;
  board[1][4] = 4;
  board[1][5] = 4;
  turn = 1;
  displayTurn();
  populateBoard();
}

//assign a click event listener to all circles
for(var i = 0; i < 6;i++){
  for(var j = 0; j < 2;j++){
    const row = j;
    const col = i;
    document.getElementById("row-"+ row + "-" + col)
    .addEventListener('click', function(event){
      event.preventDefault();
      processMove(row, col);
    });
  }
}
//assign a click event to all scores (just calls the illegalMove())
document.getElementById("row-0-score")
.addEventListener('click', function(event){
  event.preventDefault();
  illegalMove();
});
document.getElementById("row-1-score")
.addEventListener('click', function(event){
  event.preventDefault();
  illegalMove();
});

populateBoard();
displayTurn();
