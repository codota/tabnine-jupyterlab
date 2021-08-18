import { Cell } from "@jupyterlab/cells";

export function dummyFilenameByCellType(cell: Cell) {
  switch (cell?.model?.type) {
    case "markdown":
      return "test.md";
    default:
      return "test.py";
  }
}
