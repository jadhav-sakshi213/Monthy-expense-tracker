document.addEventListener("DOMContentLoaded", function () {
    const dateInput = document.getElementById("expense-date");

    dateInput.addEventListener("focus", function () {
        dateInput.type = "date";
    });

    dateInput.addEventListener("blur", function () {
        if (!dateInput.value) {
            dateInput.type = "text";
            dateInput.placeholder = "Date";
        }
    });

    // Set placeholder initially
    if (!dateInput.value) {
        dateInput.type = "text";
        dateInput.placeholder = "Date";
    }

    document.getElementById("filter-category").addEventListener("change", updateTable);

});






document.addEventListener("DOMContentLoaded", function () {
    const inputs = document.querySelectorAll("input, select");

    inputs.forEach((input, index) => {
        input.addEventListener("keypress", function (event) {
            if (event.key === "Enter") {
                event.preventDefault(); // Prevent form submission

                if (index < inputs.length - 1) {
                    inputs[index + 1].focus(); // Move to next field
                } else {
                    document.getElementById("add-btn").click(); // Submit form if last field
                }
            }
        });
    });
});


let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
let editIndex = -1;
let expenseChart;
document.getElementById("add-btn").addEventListener("click", addExpense);

function addExpense() {
    const name = document.getElementById("expense-name").value.trim();
    const amount = parseFloat(document.getElementById("expense-amount").value);
    const date = document.getElementById("expense-date").value;
    const category = document.getElementById("expense-category").value;

    if (!name || isNaN(amount) || !date || !category) {
        alert("Please fill all fields correctly.");
        return;
    }

    if (editIndex !== -1) {
        expenses[editIndex] = { name, amount, date, category };
        editIndex = -1;
    } else {
        expenses.push({ name, amount, date, category });
    }

    localStorage.setItem("expenses", JSON.stringify(expenses));
    updateTable();
    updateChart();
    clearInputs();
}

function editExpense(index) {
    document.getElementById("expense-name").value = expenses[index].name;
    document.getElementById("expense-amount").value = expenses[index].amount;
    document.getElementById("expense-date").value = expenses[index].date;
    document.getElementById("expense-category").value = expenses[index].category;
    editIndex = index;
}

function removeExpense(index) {
    expenses.splice(index, 1);
    localStorage.setItem("expenses", JSON.stringify(expenses));
    updateTable();
    updateChart();
}


function updateTable() {
    const table = document.getElementById("expense-list");
    table.innerHTML = "";
    let totalExpense = 0;
    const selectedCategory = document.getElementById("filter-category").value;
    const selectedCurrency = document.getElementById("currency").value; // Get selected currency

    // Sort expenses by date in ascending order
    expenses.sort((a, b) => new Date(a.date) - new Date(b.date));

    expenses.forEach((expense, index) => {
        if (selectedCategory === "All" || expense.category === selectedCategory) {
            totalExpense += expense.amount;

            // Convert date format to DD-MM-YY
            const formattedDate = new Date(expense.date).toLocaleDateString('en-GB', {
                day: '2-digit', month: '2-digit', year: '2-digit'
            });

            const row = document.createElement("tr");
            row.innerHTML = `<td>${expense.name}</td>
                     <td>${selectedCurrency} ${expense.amount.toFixed(2)}</td>
                     <td>${formattedDate}</td>
                     <td>${expense.category}</td>
                     <td>
                        <button onclick="editExpense(${index})">Edit</button>
                        <button onclick="removeExpense(${index})">Remove</button>
                     </td>`;
            table.appendChild(row);
        }
    });

    // Update total expense with selected currency
    document.getElementById("currency-symbol").textContent = selectedCurrency;
    document.getElementById("total-expense").textContent = totalExpense.toFixed(2);
}

// Add event listener to update currency symbol dynamically
document.getElementById("currency").addEventListener("change", updateTable);





function updateChart() {
    const categoryTotals = {};
    expenses.forEach(expense => {
        categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
    });
    if (expenseChart) {
        expenseChart.destroy();
    }
    const ctx = document.getElementById("expense-chart").getContext("2d");
    expenseChart = new Chart(ctx, {
        type: "pie",
        data: {
            labels: Object.keys(categoryTotals),
            datasets: [{
                data: Object.values(categoryTotals),
                backgroundColor: ['#f94144','#f3722c','#f8961e','#f9c74f','#90be6d','#43aa8b','#577590']
            }]
        }
    });
}

function clearInputs() {
    document.getElementById("expense-name").value = "";
    document.getElementById("expense-amount").value = "";
    document.getElementById("expense-date").value = "";
    document.getElementById("expense-category").selectedIndex = 0;
}


document.addEventListener("DOMContentLoaded", function () {
    updateTable();
    updateChart(); // Ensure the chart updates when the page loads
});