const NAME = 1;
const TRIBE = 12;

const table = document.querySelector("table");
const headRow = document.querySelector("thead tr");
const tbody = document.querySelector("tbody");
const hideBoss = document.querySelector("#hide-boss");
const showA = document.querySelector("#show-a");
const tribesBox = document.querySelector("#tribes");

let rows = [];
let sortColumn = 0;
let sortAscending = true;

// A種族値の列 (A_H, A_A, A_M, A_D, A_S)
function isAColumn(i) {
  return 2 <= i && i <= 6;
}

function compare(a, b) {
  if (sortColumn === NAME || sortColumn === TRIBE) {
    return a[sortColumn].localeCompare(b[sortColumn], "ja");
  }
  return a[sortColumn] - b[sortColumn];
}

function render() {
  const checkedTribes = [...tribesBox.querySelectorAll("input:checked")].map((input) => input.value);
  const shown = rows.filter((row) => {
    if (hideBoss.checked && row[TRIBE] === "ボス") return false;
    return row[TRIBE] === "ボス" || checkedTribes.includes(row[TRIBE]);
  });
  shown.sort(compare);
  if (!sortAscending) shown.reverse();

  tbody.innerHTML = shown
    .map((row) => {
      const cells = row.map((v, i) => `<td${isAColumn(i) ? ' class="a"' : ""}>${v}</td>`);
      return `<tr data-tribe="${row[TRIBE]}">${cells.join("")}</tr>`;
    })
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
      th.className = isAColumn(i) ? "a" : "";
      th.addEventListener("click", () => sortBy(i));
      headRow.append(th);
    });

    // 出てきた順に、ボス以外の種族のチェックボックスを作る
    const tribes = new Set(rows.map((row) => row[TRIBE]));
    tribes.delete("ボス");
    for (const tribe of tribes) {
      const label = document.createElement("label");
      label.dataset.tribe = tribe;
      label.innerHTML = `<input type="checkbox" value="${tribe}" checked> ${tribe}`;
      tribesBox.append(label);
    }
    render();
  });

hideBoss.addEventListener("change", render);
tribesBox.addEventListener("change", render);
showA.addEventListener("change", () => table.classList.toggle("show-a", showA.checked));
