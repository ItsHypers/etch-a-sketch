let color = "black";
let click = true;
let gradient = false;

function fillBoard(size) {
  let board = document.querySelector(".board");
  let squares = board.querySelectorAll("div");
  squares.forEach((div) => div.remove());
  board.style.gridTemplateColumns = `repeat(${size} , 1fr)`;
  board.style.gridTemplateRows = `repeat(${size} , 1fr)`;

  let amount = size * size;
  for (let i = 0; i < amount; i++) {
    let square = document.createElement("div");
    square.addEventListener("mouseover", colorin);
    square.style.backgroundColor = "white";
    board.insertAdjacentElement("beforeend", square);
  }
}
boardSize(16);
function resizeCanvas(size) {
  if (size >= 200 || size <= 1000) {
    let board = document.querySelector(".board");
    board.style.width = size + "px";
    board.style.height = size + "px";
    board.style.maxHeight = size + "px";
    board.style.maxWidth = size + "px";
  }
}
function boardSize(input) {
  if (input >= 2 || input <= 150) {
    fillBoard(input);
  }
}

function colorin() {
  if (click) {
    if (gradient) {
      this.style.opacity -= "-0.1";
    } else {
      this.style.opacity = "1";
    }
    if (color == "random") {
      this.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
    } else {
      this.style.backgroundColor = color;
    }
  }
}

function gradientToggle() {
  gradient = !gradient;
  if (gradient) {
    document.querySelector("#Gradient").textContent = "On";
  } else {
    document.querySelector("#Gradient").textContent = "Off";
  }
}

function changeColor(choice) {
  color = choice;
}

function resetBoard() {
  let board = document.querySelector(".board");
  let squares = board.querySelectorAll("div");
  squares.forEach((div) => (div.style.backgroundColor = "white"));
  squares.forEach((div) => (div.style.opacity = ""));
}

document.querySelector("body").onkeydown = function (e) {
  if (e.key == "Shift") {
    click = !click;
    if (click) {
      document.querySelector(".mode").textContent = "Pen Active";
    } else {
      document.querySelector(".mode").textContent = "Pen Inactive";
    }
  }
};

document.querySelectorAll("input[type=color]").forEach(function (picker) {
  var targetLabel = document.querySelector('label[for="' + picker.id + '"]'),
    codeArea = document.createElement("span");

  codeArea.innerHTML = picker.value;
  targetLabel.appendChild(codeArea);

  picker.addEventListener("change", function () {
    codeArea.innerHTML = picker.value;
    changeColor(picker.value);
    targetLabel.appendChild(codeArea);
  });
});
