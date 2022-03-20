enum CellType {
  EMPTY = ".",
  MINE = "x",
  NEXT = "NEXT",
}

type Cell = {
  type: CellType;
  value?: number;
};

type Grid = Cell[][];

const toString = (cell: Cell) => {
  switch (cell.type) {
    case CellType.NEXT:
      return String(cell.value);
    default:
      return ".";
  }
};

const incCell = (grid: Grid, x: number, y: number) => {
  if (x < 0 || x > grid[0].length - 1 || y < 0 || y > grid.length - 1) {
    return;
  }

  let cell = grid[y][x];

  if (!cell) {
    throw new Error(`Unknown cell {x=${x}; y=${y}}`);
  }

  if (cell.type === CellType.MINE) {
    return;
  }

  if (cell.value === undefined) {
    cell.value = 1;
  } else {
    cell.value += 1;
  }

  cell.type = CellType.NEXT;
};

function main(readline) {
  const grid: Grid = [];
  const w: number = parseInt(readline());
  const h: number = parseInt(readline());

  for (let y = 0; y < h; y++) {
    const line = [];
    grid.push(line);

    const rawLine: string = readline();
    for (let x = 0; x < w; x++) {
      grid[y].push({
        type: rawLine[x] === "x" ? CellType.MINE : CellType.EMPTY,
        value: 0,
      });
    }
  }

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const cell = grid[y][x];

      if (cell.type === CellType.MINE) {
        incCell(grid, x - 1, y - 1);
        incCell(grid, x, y - 1);
        incCell(grid, x + 1, y - 1);

        incCell(grid, x - 1, y);
        incCell(grid, x + 1, y);

        incCell(grid, x - 1, y + 1);
        incCell(grid, x, y + 1);
        incCell(grid, x + 1, y + 1);
      }
    }
  }

  grid.forEach((line) => {
    console.log(line.map(toString).join(""));
  });
}

// CHANGE THIS ON CODINGAME
// main(readline)
// CHANGE THIS IN JEST
export { main };
