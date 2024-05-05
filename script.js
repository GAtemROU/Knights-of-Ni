import {Solver} from "./solver.js"

document.addEventListener("DOMContentLoaded", function () {
  const shrubberiesContainer = document.querySelector(".shrubberiesContainer");
  const grid = document.querySelector(".grid");
  const regenerateBtn = document.getElementById("regenerateBtn");
  const leftShrubberies = document.getElementById("leftShrubberies");
  const submitBtn = document.getElementById("submitBtn");
  const min = 8;
  const max = 10;
  const mySolver = new Solver();
  var gridSize;
  var areas;
  var shrubberiesPlaced = 0;
  var lastGenShrub;
  const bigShift = 150;
  const smallShift = 90;
  var dragging = false;
  var onlySolvable = true;

  const colorShifts = [
    [-smallShift, -smallShift, 0], // blue
    [-smallShift, 0, -smallShift], // green
    [0, -smallShift, -smallShift], // red
    [-2 * smallShift, 0, 0],
    [0, -2 * smallShift, 0],
    [0, 0, -2 * smallShift],
    [-1.5 * smallShift, 0, 0],
    [0, -1.5 * smallShift, 0],
    [0, 0, -1.5 * smallShift],
    [-smallShift, -smallShift, 0], // blue
    [-smallShift, 0, -smallShift], // green
    [0, -smallShift, -smallShift], // red
    [-2 * smallShift, 0, 0],
    [0, -2 * smallShift, 0],
    [0, 0, -2 * smallShift],
    [-1.5 * smallShift, 0, 0],
    [0, -1.5 * smallShift, 0],
    [0, 0, -1.5 * smallShift],
    [-smallShift, -smallShift, 0], // blue
    [-smallShift, 0, -smallShift], // green
    [0, -smallShift, -smallShift], // red
    [-2 * smallShift, 0, 0],
    [0, -2 * smallShift, 0],
    [0, 0, -2 * smallShift],
    [-1.5 * smallShift, 0, 0],
    [0, -1.5 * smallShift, 0],
    [0, 0, -1.5 * smallShift]
  ];

  function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  function clearGrid() {
    while (grid.firstChild) {
      grid.removeChild(grid.firstChild);
    }
  }

  function clearShrubberies() {
    shrubberiesPlaced = 0;
    const toDelete = document.querySelectorAll(".shrubbery");
    toDelete.forEach(function (element) {
      element.parentNode.removeChild(element);
    });
  }

  function generateGrid() {
    gridSize = randomInt(min, max);
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        grid.appendChild(cell);
        cell.dataset.row = i;
        cell.dataset.column = j;
      }
    }
    grid.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;
    grid.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
  }

  function generateAreas() {
    const cells = document.querySelectorAll(".cell");
    areas = [];
    for (let i = 0; i < gridSize; i++) {
      const start_x = randomInt(0, gridSize);
      const start_y = randomInt(0, gridSize);
      const end_x = randomInt(start_x, gridSize);
      const end_y = randomInt(start_y, gridSize);
      areas.push([start_x, start_y, end_x, end_y]);
      for (let j = start_x; j < end_x + 1; j++) {
        for (let k = start_y; k < end_y + 1; k++) {
          const id = j + k * gridSize;
          const cell = cells[id];
          const cellColor = window
            .getComputedStyle(cell)
            .backgroundColor.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
          const cellR = parseInt(cellColor[1]) + colorShifts[i][0];
          const cellG = parseInt(cellColor[2]) + colorShifts[i][1];
          const cellB = parseInt(cellColor[3]) + colorShifts[i][2];
          cell.style.backgroundColor = `rgb(${cellR}, ${cellG}, ${cellB})`;
        }
      }
    }
    mySolver.solveTask(areas);
  }

  function highlightArea(id) {
    const cells = document.querySelectorAll(".cell");
    const area = areas[id];
    const start_x = area[0];
    const start_y = area[1];
    const end_x = area[2];
    const end_y = area[3];
    for (let i = start_x; i < end_x + 1; i++) {
      for (let j = start_y; j < end_y + 1; j++) {
        const index = i + j * gridSize;
        const cell = cells[index];
        cell.classList.add("highlightArea");
      }
    }
  }

  function deHighlightArea(id) {
    const cells = document.querySelectorAll(".cell");
    const area = areas[id];
    const start_x = area[0];
    const start_y = area[1];
    const end_x = area[2];
    const end_y = area[3];
    for (let i = start_x; i < end_x + 1; i++) {
      for (let j = start_y; j < end_y + 1; j++) {
        const index = i + j * gridSize;
        const cell = cells[index];
        cell.classList.remove("highlightArea");
      }
    }
  }

  function generateShrubbery() {
    let left = gridSize - shrubberiesPlaced;
    leftShrubberies.textContent = `✘ ${left}`;
    leftShrubberies.style.fontSize = `x-large`;
    if (left <= 0) return;
    const shrubbery = document.createElement("div");
    shrubbery.classList.add("shrubbery");
    shrubbery.draggable = true;
    shrubbery.id = `shrubbery${shrubberiesPlaced}`;
    const id = shrubberiesPlaced;
    shrubbery.addEventListener("dragstart", function (event) {
      dragging = true;
      event.dataTransfer.setData("text/plain", event.target.id);
      highlightArea(id);
    });
    shrubbery.addEventListener("dragend", function (event) {
      dragging = false;
      deHighlightArea(id);
    });
    shrubberiesContainer.insertBefore(
      shrubbery,
      shrubberiesContainer.firstChild
    );
    lastGenShrub = shrubbery.id;
  }

  function regenerateTask() {
    clearGrid();
    clearShrubberies();
    generateGrid();
    generateAreas();
    if (onlySolvable && !mySolver.isSolvable()) {
      regenerateTask();
      return;
    }
    generateShrubbery();
  }

  function checkSubmission() {
    if (shrubberiesPlaced < gridSize) {
      highlightWrong([leftShrubberies]);
      return false;
    }
    const cells = document.querySelectorAll(".cell");
    const rows = new Map();
    const columns = new Map();
    cells.forEach((cell) => {
      const row = cell.dataset.row;
      const column = cell.dataset.column;
      if (!rows.has(row)) rows.set(row, []);
      if (!columns.has(column)) columns.set(column, []);
    });
    cells.forEach((cell) => {
      const row = cell.dataset.row;
      const column = cell.dataset.column;
      if (cell.firstChild) {
        let curCells = rows.get(row);
        curCells.push(cell);
        rows.set(row, curCells);
        curCells = columns.get(column);
        curCells.push(cell);
        columns.set(column, curCells);
      }
    });
    let res = true;
    rows.forEach((row) => {
      if (row.length > 1) {
        highlightWrong(row);
        res = false
      }
    });
    columns.forEach((column) => {
      if (column.length > 1) {
        highlightWrong(column);
        res = false
      }
    });
    return res;
  }

  function highlightWrong(list) {
    list.forEach((elem => {
      elem.classList.remove("highlightWrong");
    }))
    list.forEach((elem) => {
      elem.classList.add("highlightWrong");
    });
    setTimeout(() => {
      list.forEach((elem) => {
        elem.classList.remove("highlightWrong");
      });
    }, 400);
  }

  regenerateTask();

  regenerateBtn.addEventListener("click", regenerateTask);

  // Drag over event listener to allow drop
  grid.addEventListener("dragover", function (event) {
    event.preventDefault();
  });

  // Drop event listener
  grid.addEventListener("drop", function (event) {
    event.preventDefault();
    if (!dragging) return;
    const cell = event.target;
    if (cell.classList.contains("cell"))
      cell.classList.remove("highlightDragover");
    else return;
    if (cell.firstChild) return;
    if (!cell.classList.contains("highlightArea")) return;
    const draggableId = event.dataTransfer.getData("text/plain");
    const draggableElement = document.getElementById(draggableId);
    event.target.appendChild(draggableElement);
    if (lastGenShrub === draggableId && shrubberiesPlaced < gridSize) {
      shrubberiesPlaced++;
      generateShrubbery();
    }
  });
  grid.addEventListener("dragenter", function (event) {
    const cell = event.target;
    if (cell.classList.contains("cell") && dragging && !cell.firstChild) {
      cell.classList.add("highlightDragover");
    }
  });

  grid.addEventListener("dragleave", function (event) {
    const cell = event.target;
    if (cell.classList.contains("cell") && dragging) {
      cell.classList.remove("highlightDragover");
    }
  });

  submitBtn.addEventListener("click", function (event) {
    event.preventDefault();
    const check = checkSubmission();
    if (check) {
      window.alert("Correct!");
      if (window.confirm("Knights of Ni demand you to perform another sacrifice!")) {
        regenerateTask();
      }
    }
  })

});
