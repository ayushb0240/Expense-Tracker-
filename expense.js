// expense.js

// ==== GLOBAL SELECTORS ==== 
const ctx = document.getElementById('expenseChart').getContext('2d'); 
const openModalBtn = document.getElementById('openModalBtn'); 
const modal = document.getElementById('expenseModal'); 
const closeModalBtn = document.querySelector('.close');
 const addExpenseBtn = document.getElementById('addExpenseBtn'); 
 const emojiPicker = document.getElementById('emojiPicker'); 
 const expensesContainer = document.getElementById('expenses'); 
 const downloadBtn = document.getElementById('downloadBtn');

let expenses = JSON.parse(localStorage.getItem('expenses')) || []; 
let expenseChart;

// ==== CHART SETUP ==== 
function renderChart(data) {
     const dates = data.map(e => e.date);
      const amounts = data.map(e => e.amount);

if (expenseChart) { 
    expenseChart.destroy();
 }

expenseChart = new Chart(ctx, { 
    type: 'line',
     data: {
         labels: dates, 
         datasets: [{ 
            label: 'Expense Overview',
             data: amounts,
              borderColor: '#5b47fb',
               tension: 0.4, 
               fill: false 
            }]
         }, options: { 
            responsive: true, 
            scales:
             { 
                y: { 
                    beginAtZero: true
                } 
            }
        }
    });
}

// ==== RENDER EXPENSES TO LIST ==== 
function renderExpensesList() { 
    expensesContainer.innerHTML = '';
     expenses.forEach((exp, idx) => { 
        const div = document.createElement('div'); 
        div.className = 'expense-item'; 
        div.innerHTML =
        <><span>${exp.emoji}</span><span>${exp.category}</span><span>${exp.amount}</span><span>${exp.date}</span><button onclick="deleteExpense(${idx})">❌</button></>; 
           expensesContainer.appendChild(div); }); }

// ==== DELETE EXPENSE ==== 
function deleteExpense(index) { expenses.splice(index, 1); saveToLocal(); renderExpensesList(); renderChart(expenses); updateDashboard(); }

// ==== EXPORT TO EXCEL ====
 function exportToExcel() { const worksheet = XLSX.utils.json_to_sheet(expenses); const workbook = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(workbook, worksheet, 'Expenses'); XLSX.writeFile(workbook, 'Expenses.xlsx'); }

// ==== MODAL EVENTS ==== 
openModalBtn.onclick = () => modal.style.display = 'block'; closeModalBtn.onclick = () => modal.style.display = 'none'; window.onclick = (e) => { if (e.target === modal) modal.style.display = 'none'; };

// ==== ADD EXPENSE ==== 
addExpenseBtn.onclick = () => { const emoji = emojiPicker.value || '💸'; const category = document.getElementById('expenseCategory').value; const amount = parseFloat(document.getElementById('expenseAmount').value); const date = document.getElementById('expenseDate').value;

if (!category || isNaN(amount) || !date) { alert('Please fill in all fields.'); return; }

const newExpense = { emoji, category, amount, date }; expenses.push(newExpense); saveToLocal(); renderExpensesList(); renderChart(expenses); modal.style.display = 'none'; document.getElementById('expenseForm').reset(); updateDashboard(); };

// ==== SAVE TO LOCALSTORAGE ====
 function saveToLocal() { localStorage.setItem('expenses', JSON.stringify(expenses)); }

// ==== UPDATE DASHBOARD ==== 
function updateDashboard() { const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0); localStorage.setItem('totalExpenses', totalExpenses); // Dashboard page should read this from localStorage }

// ==== INIT ==== 
renderExpensesList(); renderChart(expenses); downloadBtn.onclick = exportToExcel;
}