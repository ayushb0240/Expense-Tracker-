// income.js

// --- Initialization ---
let incomeData = JSON.parse(localStorage.getItem('incomeData')) || [];

// DOM Elements
const incomeForm         = document.getElementById("incomeForm");
const incomeAmount       = document.getElementById("incomeAmount");
const incomeSource       = document.getElementById("incomeSource");
const incomeDate         = document.getElementById("incomeDate");
const incomeGrid         = document.getElementById("incomeGrid");
const incomeChartCanvas  = document.getElementById("incomeChart");
const downloadBtn        = document.getElementById("downloadExcel");
const modal              = document.getElementById("incomeModal");
const openModalBtn       = document.getElementById("openIncomeModal");
const closeModalBtn      = document.getElementById("closeIncomeModal");
const cancelModalBtn     = document.getElementById("cancelIncomeModal");
const toast              = document.getElementById("incomeToast");
const toastMessage       = document.getElementById("toastMessage");

let incomeChart;

// --- Helper: Show Toast ---
function showToast(message) {
  toastMessage.textContent = message;
  toast.classList.remove("hidden");
  setTimeout(() => toast.classList.add("hidden"), 2000);
}

// --- Render Grid ---
function renderGrid() {
  incomeGrid.innerHTML = "";
  incomeData.forEach((inc, idx) => {
    const card = document.createElement("div");
    card.className = "flex justify-between items-center p-4 border rounded-lg";
    card.innerHTML = `
      <div class="flex items-center space-x-3">
        <span class="text-2xl">${inc.source.split(" ")[0]}</span>
        <div>
          <p class="font-semibold">${inc.source.replace(inc.source.split(" ")[0], "").trim()}</p>
          <p class="text-sm text-gray-500">${inc.date}</p>
        </div>
      </div>
      <div class="flex items-center space-x-3">
        <span class="text-green-600 font-bold">+$${inc.amount.toFixed(2)}</span>
        <button onclick="deleteIncome(${idx})" class="text-red-500 hover:text-red-700">🗑️</button>
      </div>
    `;
    incomeGrid.appendChild(card);
  });
}

// --- Chart Update ---
function updateChart() {
  const labels = incomeData.map(i => i.date);
  const data   = incomeData.map(i => i.amount);

  if (incomeChart) incomeChart.destroy();
  incomeChart = new Chart(incomeChartCanvas, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Income',
        data,
        backgroundColor: '#6366f1'
      }]
    },
    options: {
      responsive: true,
      scales: { y: { beginAtZero: true } }
    }
  });
}

// --- Save & Re-render ---
function saveAndRefresh() {
  localStorage.setItem("incomeData", JSON.stringify(incomeData));
  renderGrid();
  updateChart();
}

// --- Add Income ---
incomeForm.addEventListener("submit", e => {
  e.preventDefault();
  incomeData.push({
    source: incomeSource.value,
    amount: parseFloat(incomeAmount.value),
    date:   incomeDate.value
  });
  saveAndRefresh();
  showToast("Income added!");
  incomeForm.reset();
  closeModal();
});

// --- Delete Income ---
function deleteIncome(idx) {
  incomeData.splice(idx, 1);
  saveAndRefresh();
  showToast("Income deleted.");
}

// --- CSV Download ---
downloadBtn.addEventListener("click", () => {
  let csv = "Source,Amount,Date\n";
  incomeData.forEach(i => csv += `${i.source},${i.amount},${i.date}\n`);
  const blob = new Blob([csv], { type: "text/csv" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href       = url;
  a.download   = "income-data.csv";
  a.click();
  URL.revokeObjectURL(url);
});

// --- Modal Controls ---
function openModal()   { modal.classList.remove("hidden"); }
function closeModal()  { modal.classList.add("hidden"); }

openModalBtn.addEventListener("click", openModal);
closeModalBtn.addEventListener("click", closeModal);
cancelModalBtn.addEventListener("click", closeModal);

// --- Initial Render ---
renderGrid();
updateChart();
