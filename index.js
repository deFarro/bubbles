//var colors = ['Orchid', 'OliveDrab', 'CornflowerBlue', 'LemonChiffon'];
var background = window.getComputedStyle(document.body).backgroundColor;
var colors = ['red', 'green', 'blue', 'gold'];
//var background = 'white';

var dots = Array.from(document.querySelectorAll('td'));
var scoreBoard = document.querySelector('#score');
var turnsBoard = document.querySelector('#turns');
var againButton = document.querySelector('#again');
var field = document.querySelector('#field');
var header = document.querySelector('#header');
var boards = document.querySelector('#boards');
var score = 0, turns = 0;

againButton.addEventListener('click', startOver);
dots.forEach((dot, index) => initDots(dot, index));

function rand(x) {
  return Math.round(Math.random() * x);
}

function initDots(cell, index) {
  cell.innerHTML = '&#9673;';
  cell.style.color = colors[rand(3)];
  cell.style.fontSize = '200%';
  cell.style.fontWeight = 700;
  cell.dataset.index = index;
  cell.dataset.processed = false;
  cell.addEventListener('click', updateTurns);
  cell.addEventListener('click', clickOnDot);
}

function updateScore() {
  score += 10;
  scoreBoard.innerHTML = score;
  if (score >= 1000) {
    scoreBoard.innerHTML = score;
    boards.classList.toggle('hidden');
    field.classList.toggle('hidden');
    header.classList.toggle('hidden');
    header.innerHTML = `Done! Your efficiency is ${(score / turns).toFixed(2)} points per turn. ${turns} turns in total.`;
    againButton.classList.toggle('hidden');
  }
}

function startOver() {
  againButton.classList.toggle('hidden');
  score = 0, turns = 0;
  turnsBoard.innerHTML = turns;
  scoreBoard.innerHTML = score;
  header.classList.toggle('hidden');
  boards.classList.toggle('hidden');
  resetStatuses();
  dots.forEach((dot, index) => initDots(dot, index));
  field.classList.toggle('hidden');
}

function updateTurns() {
  turns++;
  turnsBoard.innerHTML = turns;
}

function updateField() {
  for (let i = dots.length; i >= 0; i--) {
    if (dots[i + 10] === undefined) {
      continue;
    }
    if (dots[i].style.color === background) {
      continue;
    }
      dropDot(i);
  }
}

function dropDot(index) {
  if (dots[index + 10] === undefined) {
      return;
    }
  if (dots[index + 10].style.color === background) {
      dots[index + 10].style.color = dots[index].style.color;
      dots[index].style.color = background;
      let down = index + 10;
      dropDot(down);
    }
}

function resetStatuses() {
  dots.forEach((dot) => {
    dot.dataset.processed = false;
  });
}

function clickOnDot() {
  if (this.style.color === background) {
    return;
  }
  destroy.call(this);
  resetStatuses();
  updateField();
}

function destroy() {
  this.dataset.processed = true;
  findBros(this);
  this.style.color = background;
  updateScore();
}

var directions = [-10, 1, 10, -1];

function findBros(cell) {
  for (let step of directions) {
    let target = dots[parseInt(cell.dataset.index) + step];
    if (!target) {
      continue;
    }
    if ((parseInt(cell.dataset.index) + 1) % 10 === 0 && step === 1) {
      continue;
    }
    if (parseInt(cell.dataset.index) % 10 === 0 && step === -1) {
      continue;
    }
    if (target.style.color === background || target.dataset.processed === 'true') {
      continue;
    }
    if (cell.style.color === target.style.color) {
      destroy.call(target);
    }
  }
}