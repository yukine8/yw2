const NAME = 1;
const TRIBE = 12;

const headRow = document.querySelector("thead tr");
const tbody = document.querySelector("tbody");
const hideBoss = document.querySelector("#hide-boss");

let rows = [];
let sortColumn = 0;
let sortAscending = true;

function compare(a, b) {
  if (sortColumn === NAME || sortColumn === TRIBE) {
    return a[sortColumn].localeCompare(b[sortColumn], "ja");
  }
  return a[sortColumn] - b[sortColumn];
}

function render() {
  const shown = rows.filter((row) => !(hideBoss.checked && row[TRIBE] === "ボス"));
  shown.sort(compare);
  if (!sortAscending) shown.reverse();

  tbody.innerHTML = shown
    .map((row) => `<tr data-tribe="${row[TRIBE]}">${row.map((v) => `<td>${v}</td>`).join("")}</tr>`)
    .join("");

  headRow.querySelectorAll("th").forEach((th, i) => {
    th.ariaSort = i === sortColumn ? (sortAscending ? "ascending" : "descending") : null;
  });
}

function sortBy(column) {
  sortAscending = column === sortColumn ? !sortAscending : true;
  sortColumn = column;
  render();
}

fetch("data.csv")
  .then((res) => res.text())
  .then((text) => {
    const [header, ...lines] = text.trim().split("\n");
    rows = lines.map((line) => line.split(","));

    header.split(",").forEach((title, i) => {
      const th = document.createElement("th");
      th.textContent = title;
      th.addEventListener("click", () => sortBy(i));
      headRow.append(th);
    });
    render();
  });

hideBoss.addEventListener("change", render);
