// Wait until the DOM is loaded 
document.addEventListener("DOMContentLoaded", function () {
  const setupModal = document.getElementById("setupModal");
  const setupForm = document.getElementById("setupForm");
  const userInput = document.getElementById("userInput");
  const balanceInput = document.getElementById("balanceInput");
  const sidebarUser  = document.getElementById("sidebarUserName");
  const closeSetupModalBtn = document.getElementById("closeSetupModal");
  const totalBalanceDisplay = document.getElementById("totalBalance");
  const totalIncomeDisplay = document.getElementById("totalIncome");
  const totalExpensesDisplay = document.getElementById("totalExpenses");
  const transactionList = document.getElementById("transactionList");
  const addBalanceBtn = document.getElementById("addBalanceBtn");

  // Check if user data already exists in localStorage
  let userData = JSON.parse(localStorage.getItem("userData"));

  if (!userData || !userData.name || !userData.totalBalance) {
    setupModal.classList.remove("hidden");
  } else {
    displayUser (userData);
  }

  // Handle form submission to save user data
  setupForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const name = userInput.value.trim();
    const totalBalance = parseFloat(balanceInput.value);
    userData = { name, totalBalance };
    localStorage.setItem("userData", JSON.stringify(userData));
    displayUser (userData);
    setupModal.classList.add("hidden");
  });

  // Allow manual closing of the modal
  closeSetupModalBtn.addEventListener("click", () => {
    setupModal.classList.add("hidden");
  });

  // Display user data in sidebar and header
  function displayUser (data) {
    sidebarUser.textContent = data.name;
    totalBalanceDisplay.textContent = `₹${data.totalBalance}`;
    updateDashboard();
  }

  // Get and calculate totals
  function updateDashboard() {
    const incomeList = JSON.parse(localStorage.getItem("incomeList")) || [];
    const expenseList = JSON.parse(localStorage.getItem("expenseList")) || [];

    let totalIncome = incomeList.reduce((sum, item) => sum + parseFloat(item.amount), 0);
    let totalExpenses = expenseList.reduce((sum, item) => sum + parseFloat(item.amount), 0);
    let netBalance = userData.totalBalance + totalIncome - totalExpenses;

    totalIncomeDisplay.textContent = `₹${totalIncome}`;
    totalExpensesDisplay.textContent = `₹${totalExpenses}`;
    totalBalanceDisplay.textContent = `₹${netBalance}`;

    // Show recent 5 transactions (from both income and expense)
    const allTransactions = [
      ...incomeList.map(i => ({ ...i, type: "income" })),
      ...expenseList.map(e => ({ ...e, type: "expense" }))
    ];

    const sorted = allTransactions.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
    transactionList.innerHTML = "";
    sorted.forEach(tx => {
      const li = document.createElement("li");
      li.className = `flex justify-between ${tx.type === "income" ? "text-green-600" : "text-red-500"}`;
      li.innerHTML = `
        <span>${tx.type === "income" ? tx.source : tx.category}</span>
        <span>₹${tx.amount}</span>
      `;
      transactionList.appendChild(li);
    });

    renderCharts(incomeList, expenseList);
  }

  function renderCharts(incomeList, expenseList) {
    // Overview Chart (Doughnut)
    const overviewCtx = document.getElementById("overviewChart").getContext("2d");
    new Chart(overviewCtx, {
      type: "doughnut",
      data: {
        labels: ["Total Balance", "Total Expenses", "Total Income"],
        datasets: [{
          data: [
            userData.totalBalance,
            expenseList.reduce((s, e) => s + parseFloat(e.amount), 0),
            incomeList.reduce((s, i) => s + parseFloat(i.amount), 0)
          ],
          backgroundColor: ["#3B82F6", "#EF4444", "#10B981"],
        }],
      },
    });

    // Expense Chart (Bar)
    const expenseCtx = document.getElementById("expenseChart").getContext("2d");
    const lastExpenses = expenseList.slice(-5);
    new Chart(expenseCtx, {
      type: "bar",
      data: {
        labels: lastExpenses.map(e => e.date),
        datasets: [{
          label: "Expenses",
          data: lastExpenses.map(e => e.amount),
          backgroundColor: "#EF4444",
        }],
      },
    });

    // Income Chart (Bar)
    const incomeCtx = document.getElementById("incomeChart").getContext("2d");
    const lastIncome = incomeList.slice(-5);
    new Chart(incomeCtx, {
      type: "bar",
      data: {
        labels: lastIncome.map(i => i.date),
        datasets: [{
          label: "Income",
          data: lastIncome.map(i => i.amount),
          backgroundColor: "#10B981",
        }],
      },
    });
  }

  // Add balance button functionality
  addBalanceBtn.addEventListener("click", () => {
    setupModal.classList.remove("hidden");
  });
});