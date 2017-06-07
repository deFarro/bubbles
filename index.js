var background = window.getComputedStyle(document.body).backgroundColor;
var colors = ['red', 'green', 'blue', 'gold'];

var dots = Array.from(document.querySelectorAll('td'));
var scoreBoard = document.querySelector('#score');
var turnsBoard = document.querySelector('#turns');
var againButton = document.querySelector('#again');
var field = document.querySelector('#field');
var header = document.querySelector('#header');
var boards = document.querySelector('#boards');
var score = 0, turns = 0;

againButton.addEventListener('click', startOver);

function rand(x) {
  return Math.round(Math.random() * x);
}

// Расставляем шарики на поле. Задаём случайный цвет, вешаем обработчики
dots.forEach((dot, index) => initDots(dot, index));
function initDots(cell, index) {
  cell.innerHTML = '&#9673;';
  cell.style.color = colors[rand(3)];
  cell.style.fontSize = '200%';
  cell.style.fontWeight = 700;
  cell.dataset.index = index;
  cell.dataset.processed = false;
  cell.addEventListener('click', clickOnDot);
}

// Фунция клика по шарику. Обновляет счётчих ходов и запускает нужные функции
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

// Функция "уничтожения" шарика
function destroy() {
  this.dataset.processed = true;
  findBros(this);
  // Перекрашиваем шарик в цвет фона на обратном проходе рекурсии
  this.style.color = background;
  updateScore();
}

// Массив с направлениями проверки соседних клеток
var directions = [-10, 1, 10, -1];

// Функция проверки соседний клеток на совпадение цвета. Если "брат" найден, функция вызывается рекурсивно уже для него
function findBros(cell) {
  for (let step of directions) {
    let target = dots[parseInt(cell.dataset.index) + step];
    if (!target) {
      continue;
    }
    // Если шарик, который мы проверяем стоит в правой крайней колонке - соседей справа не проверяем
    if ((parseInt(cell.dataset.index) + 1) % 10 === 0 && step === 1) {
      continue;
    }
    // То же самое, если стоит в левой крайней
    if (parseInt(cell.dataset.index) % 10 === 0 && step === -1) {
      continue;
    }
    // Если соседняя клетка пустая, либо мы её уже проверяли идём дальше
    if (target.style.color === background || target.dataset.processed === 'true') {
      continue;
    }
    if (cell.style.color === target.style.color) {
      destroy.call(target);
    }
  }
}

// Функция сброса статуса "проверен", которым помечаются найденные соседи одного цвета
function resetStatuses() {
  dots.forEach((dot) => {
    dot.dataset.processed = false;
  });
}

// Функция обновления поля - если под шариком есть свободное место, мы его роняем
function updateField() {
  for (let i = dots.length; i >= 0; i--) {
  // Клетки в нижнем ряду игнорируем
    if (!dots[i + 10]) {
      continue;
    }
  // Как и уничтоженные шарики
    if (dots[i].style.color === background) {
      continue;
    }
    dropDot(i);
  }
}

// Функция перерисовки шарика ниже, пока есть свободное место или не закончится поле
function dropDot(index) {
  if (!dots[index + 10]) {
    return;
    }
  if (dots[index + 10].style.color === background) {
    dots[index + 10].style.color = dots[index].style.color;
    dots[index].style.color = background;
    let down = index + 10;
    // Вызываем эту же функцию для перерисованного ниже шарика
    dropDot(down);
    }
}

// Функция для обновления счёта. Если все шарики уничтожены - выводим экран с результатом
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

// Функция начала новой партии. Обнуляем счётчики, заново инициализируем шарики
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
