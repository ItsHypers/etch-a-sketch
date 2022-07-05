let color = "black";
let click = true;
let opacity = false;
let hover = true;
let shading = false;
let gridSize = 0;
let bgColor = "#ffffff";

function fillBoard(size) {
  let board = document.querySelector(".board");
  let squares = board.querySelectorAll("div");
  squares.forEach((div) => div.remove());
  board.style.gridTemplateColumns = `repeat(${size} , 1fr)`;
  board.style.gridTemplateRows = `repeat(${size} , 1fr)`;
  gridSize = size;
  let amount = size * size;
  for (let i = 0; i < amount; i++) {
    let square = document.createElement("div");
    square.addEventListener("mouseover", colorin);
    square.addEventListener("click", colorFill);
    square.style.backgroundColor = "white";
    square.className = "grid-item";
    board.insertAdjacentElement("beforeend", square);
  }
}
boardSize(16);

let mouseDown = false;
window.onmousedown = () => {
  mouseDown = true;
  if (mouseDown) {
    console.log("mouse button down");
  }
};
window.onmouseup = () => {
  mouseDown = false;
  if (mouseDown) {
    console.log("mouse button up");
  }
};
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
  if (input >= 2 && input <= 150) {
    fillBoard(input);
  } else {
    console.log("error");
  }
}

function colorin(e) {
  if (click) {
    if (mouseDown) {
      if (opacity) {
        this.style.opacity = 0;
      } else {
        this.style.opacity = "1";
      }
      if (color == "Rainbow") {
        this.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
      } else {
        this.style.backgroundColor = color;
        let ogIndex = Array.from(e.target.parentElement.children).indexOf(
          e.target
        );
        getAround(ogIndex);
      }
    }
  }
}
function penType() {
  hover = !hover;
  let board = document.querySelector(".board");
  let squares = board.querySelectorAll("div");
  if (hover) {
    squares.forEach((div) => div.addEventListener("mouseover", colorin));
    squares.forEach((div) => div.removeEventListener("click", colorin));
    document.querySelector(".currentPen").textContent = "Current Pen: Hover";
  } else {
    squares.forEach((div) => div.removeEventListener("mouseover", colorin));
    squares.forEach((div) => div.addEventListener("click", colorin));
    document.querySelector(".currentPen").textContent = "Current Pen: Click";
  }
}
function opacityToggle() {
  opacity = !opacity;
  if (opacity) {
    document.querySelector("#opacity").textContent = "On";
    document.querySelector(".opacityCurrent").textContent = "Opacity: On";
  } else {
    document.querySelector("#opacity").textContent = "Off";
    document.querySelector(".opacityCurrent").textContent = "Opacity: Off";
  }
}

function changeColor(choice) {
  color = choice;
  document.querySelector(
    ".currentColor"
  ).textContent = `Current Colour: ${color}`;
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

const buttonSave = document.querySelector("#buttonSave");
buttonSave.addEventListener("click", () =>
  domtoimage
    .toBlob(document.querySelector(".board"))
    .then((blob) => window.saveAs(blob, "sketch.png"))
); // eslint-disable-line no-undef

function border(picker) {
  document.querySelector(".board").style.borderColor = picker.toString("hex");
}

function hexChange(picker) {
  changeColor(picker.toString("hex"));
}

function getAround(index) {
  let around = [];

  // For Edge Condition
  index = Number(index);
  if (isNaN(index)) {
    throw new Error("Index should be a number.");
  }

  const leftEdge = index % gridSize === 0; // Tile on very left edge
  const rightEdge = (index + 1) % gridSize === 0; // Tile on right edge
  const topEdge = Math.floor(index / gridSize) === 0; // Tile on top edge
  const bottomEdge = Math.floor(index / gridSize) === gridSize - 1; // Tile on bottom edge

  if (!leftEdge) around.push(index - 1);
  if (!rightEdge) around.push(index + 1);
  if (!topEdge) around.push(index - gridSize);
  if (!bottomEdge) around.push(index + gridSize);
  return around;
}

const colorFillButton = document.querySelector("#color-fill");
let fill = false;
colorFillButton.addEventListener("click", () => {
  if (fill) {
    fill = false;
    click = true;
    colorFillButton.style.backgroundColor = "white";
    document.querySelector(".fillCurrent").textContent = "Color Fill: Off";
  } else {
    fill = true;
    click = false;
    colorFillButton.style.backgroundColor = "gray";
    document.querySelector(".fillCurrent").textContent = "Color Fill: ON";
  }
});
function toMatrix(arr, width) {
  return arr.reduce(function (rows, key, index) {
    return (
      (index % width == 0
        ? rows.push([key])
        : rows[rows.length - 1].push(key)) && rows
    );
  }, []);
}

function getAdjacent1D(x, gridX, gridY) {
  let xAbove = null;
  let xBellow = null;
  let xLeft = null;
  let xRight = null;

  if (gridX != 0) {
    xAbove = [x - gridSize];
  }
  if (gridX != gridSize - 1) {
    xBellow = [x + gridSize];
  }
  if (gridY != 0) {
    xLeft = [x - 1];
  }
  if (gridY != gridSize - 1) {
    xRight = [x + 1];
  }
  return [xAbove, xBellow, xLeft, xRight];
}
function colorFill(e) {
  if (fill) {
    let ogIndex = Array.from(e.target.parentElement.children).indexOf(e.target);

    let toFill = [ogIndex];
    let addedToFill = 1;

    gridItems = document.querySelectorAll(".grid-item");
    let gridItemsArray = Array.from(gridItems);

    let gridItemsArray2D = toMatrix(gridItemsArray, gridSize);

    let gridX = Math.floor(ogIndex / gridSize);
    let gridY = ogIndex % gridSize;

    while (addedToFill != 0) {
      let toCheck = toFill.slice(-addedToFill);
      let addedItems = [];
      addedToFill = 0;
      for (let j = 0; j < toCheck.length; j++) {
        let toAdd = getAdjacent1D(toCheck[j], gridX, gridY);
        for (let i = 0; i < toAdd.length; i++) {
          if (toAdd[i] != null) {
            if (!toFill.includes(toAdd[i][0])) {
              if (
                toAdd[i][0] >= 0 &&
                toAdd[i][0] < gridSize ** 2 &&
                typeof toAdd[i][0] == "number"
              ) {
                if (
                  e.target.parentElement.children[toAdd[i][0]].style
                    .backgroundColor == e.target.style.backgroundColor
                ) {
                  toFill.push(toAdd[i][0]);
                  addedItems.push(toAdd[i][0]);
                }
              }
            }
          }
        }
      }
      addedToFill = addedItems.length;
    }

    for (let i = 0; i < toFill.length; i++) {
      if (color == "Rainbow") {
        e.target.parentElement.children[toFill[i]].style.backgroundColor =
          randomColor();
      } else if (opacity) {
        e.target.parentElement.children[toFill[i]].style.opacity = 0;
      } else {
        e.target.parentElement.children[toFill[i]].style.backgroundColor =
          color;
      }
    }

    colorFillButton.classList.remove("btn-on");
  }
}
function randomColor() {
  // return "#" + Math.floor(Math.random()*16777215).toString(16);
  // this returns fewer colors but they are all nice and bright
  return `hsl(${Math.random() * 360}, 100%, 50%)`;
}
