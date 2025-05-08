const form = document.getElementById('runForm');
const tableBody = document.querySelector('#runTable tbody');
const totalList = document.getElementById('totalList');
const search = document.getElementById('search');
let runs = JSON.parse(localStorage.getItem('runs') || '[]');

function saveRuns() {
  localStorage.setItem('runs', JSON.stringify(runs));
}

function renderTable() {
  const searchTerm = search.value.toLowerCase();
  tableBody.innerHTML = '';
  let sortedRuns = [...runs].sort((a, b) => b.distance - a.distance);
  sortedRuns.forEach((run, index) => {
    if (!run.name.toLowerCase().includes(searchTerm)) return;
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${run.name}</td>
      <td>${run.date}</td>
      <td>${run.distance}</td>
      <td>${run.image ? '<img src="' + run.image + '">' : ''}</td>
      <td><button onclick="deleteRun(${run.id})">ลบ</button></td>
    `;
    tableBody.appendChild(row);
  });
  updateTotal();
}

function updateTotal() {
  const totals = {};
  runs.forEach(run => {
    totals[run.name] = (totals[run.name] || 0) + parseFloat(run.distance);
  });
  const sorted = Object.entries(totals).sort((a, b) => b[1] - a[1]);
  totalList.innerHTML = '';
  sorted.forEach(([name, total]) => {
    const li = document.createElement('li');
    li.textContent = `${name}: ${total.toFixed(2)} กม.`;
    totalList.appendChild(li);
  });
}

function deleteRun(id) {
  runs = runs.filter(run => run.id !== id);
  saveRuns();
  renderTable();
}

form.addEventListener('submit', e => {
  e.preventDefault();
  const name = document.getElementById('name').value;
  const date = document.getElementById('date').value;
  const distance = document.getElementById('distance').value;
  const imageInput = document.getElementById('image');
  const reader = new FileReader();
  reader.onload = function () {
    runs.push({
      id: Date.now(),
      name, date, distance,
      image: imageInput.files[0] ? reader.result : null
    });
    saveRuns();
    renderTable();
    form.reset();
  };
  if (imageInput.files[0]) {
    reader.readAsDataURL(imageInput.files[0]);
  } else {
    reader.onload();
  }
});

search.addEventListener('input', renderTable);

renderTable();
