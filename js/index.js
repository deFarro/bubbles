'use strict';

var background = window.getComputedStyle(document.body).backgroundColor;
var colors = ['red', 'green', 'blue', 'gold'];

var dots = Array.from(document.querySelectorAll('td'));
var scoreBoard = document.querySelector('#score');
var turnsBoard = document.querySelector('#turns');
var againButton = document.querySelector('#again');
var field = document.querySelector('#field');
var header = document.querySelector('#header');
var boards = document.querySelector('#boards');
var score = 0,
    turns = 0;

againButton.addEventListener('click', startOver);

// Array for directions needed to check neighbour cells
var directions = [-10, 1, 10, -1];

function rand(x) {
  return Math.round(Math.random() * x);
}

// Putting bubbles on the field. Generating random color for a bubble, adding listeners
dots.forEach(function (dot, index) {
  return initDots(dot, index);
});
function initDots(cell, index) {
  cell.innerHTML = '&#9673;';
  cell.style.color = colors[rand(3)];
  cell.style.fontSize = '200%';
  cell.style.fontWeight = 700;
  cell.dataset.index = index;
  cell.dataset.processed = false;
  cell.addEventListener('click', clickOnDot);
}

// Function to click on a bubble. It refreshes turns counter and launches proper callback functions
function clickOnDot() {
  if (this.style.color === background) {
    return;
  }
  turns++;
  turnsBoard.innerHTML = turns;
  destroy.call(this);
  resetStatuses();
  updateField();
}

// Function to “destroy” a bubble
function destroy() {
  this.dataset.processed = true;
  findBros(this, directions);
  // It repaints bubble to background color on the way back from recursive calls
  this.style.color = background;
  updateScore();
}

// Function to check if neighbour cells match the color of original cell. If it finds a “brother” it calls itself for found cell
function findBros(cell, directions) {
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = directions[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var step = _step.value;

      var target = dots[parseInt(cell.dataset.index) + step];
      if (!target) {
        continue;
      }
      // If we check cell in the first column from the right, we don’t check neighbour from the right
      if ((parseInt(cell.dataset.index) + 1) % 10 === 0 && step === 1) {
        continue;
      }
      // The same thing for the first column from the left
      if (parseInt(cell.dataset.index) % 10 === 0 && step === -1) {
        continue;
      }
      // If neighbour cell is empty or we have already checked it, we skip it
      if (target.style.color === background || target.dataset.processed === 'true') {
        continue;
      }
      if (cell.style.color === target.style.color) {
        destroy.call(target);
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }
}

// Function to reset “cheched” stasuses which we used to mark cells we had finished with
function resetStatuses() {
  dots.forEach(function (dot) {
    dot.dataset.processed = false;
  });
}

// Function to update the field. If there is empy space under a bubble, we drop it down
function updateField() {
  for (var i = dots.length; i >= 0; i--) {
    // Ignores dots in bottom row
    if (!dots[i + 10]) {
      continue;
    }
    // As well as destroyed bubbles
    if (dots[i].style.color === background) {
      continue;
    }
    dropDot(i);
  }
}

// Function for redraw a bubble one row below if these us any free space or the field ends
function dropDot(index) {
  if (!dots[index + 10]) {
    return;
  }
  if (dots[index + 10].style.color === background) {
    dots[index + 10].style.color = dots[index].style.color;
    dots[index].style.color = background;
    var down = index + 10;
    // Function calls itself for the bubble redrawn below
    dropDot(down);
  }
}

// Function for updating the score. If all bubbles are destroyed it displays the screen with results
function updateScore() {
  score += 10;
  scoreBoard.innerHTML = score;
  if (score >= 1000) {
    scoreBoard.innerHTML = score;
    boards.classList.toggle('hidden');
    field.classList.toggle('hidden');
    header.classList.toggle('hidden');
    header.innerHTML = 'Done! Your efficiency is ' + (score / turns).toFixed(2) + ' points per turn. ' + turns + ' turns in total.';
    againButton.classList.toggle('hidden');
  }
}

// Function for restarting the game. Nullifies the score, initializes bubbles on the field
function startOver() {
  againButton.classList.toggle('hidden');
  score = 0, turns = 0;
  turnsBoard.innerHTML = turns;
  scoreBoard.innerHTML = score;
  header.classList.toggle('hidden');
  boards.classList.toggle('hidden');
  resetStatuses();
  dots.forEach(function (dot, index) {
    return initDots(dot, index);
  });
  field.classList.toggle('hidden');
}