document.addEventListener("DOMContentLoaded", () => {
    const expenseForm = document.getElementById("expense-form");
    const expenseList = document.getElementById("expense-list");
    const totalAmount = document.getElementById("total-amount"); 
    const filterCategory = document.getElementById("filter-category");

    let expenses = [];

    function saveExpenses() {
        localStorage.setItem("expenses", JSON.stringify(expenses));
    }

    function loadExpenses() {
        const storedExpenses = localStorage.getItem("expenses");
        if (storedExpenses) {
            expenses = JSON.parse(storedExpenses);
            displayExpenses(expenses);
            updateTotalAmount();
        }
    }

    expenseForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const expense = {
            id: Date.now(),
            name: document.getElementById("expense-name").value,
            amount: parseFloat(document.getElementById("expense-amount").value),
            category: document.getElementById("expense-category").value,
            date: document.getElementById("expense-date").value
        };

        expenses.push(expense);
        saveExpenses();
        displayExpenses(expenses);
        updateTotalAmount();

        expenseForm.reset();
    });

    expenseList.addEventListener("click", (e) => {
        const id = Number(e.target.dataset.id);

        if (e.target.classList.contains("delete-btn")) {
            expenses = expenses.filter(exp => exp.id !== id);
            saveExpenses();
            displayExpenses(expenses);
            updateTotalAmount();
        }

        if (e.target.classList.contains("edit-btn")) {
            const expense = expenses.find(exp => exp.id === id);
            if (!expense) return;

            document.getElementById("expense-name").value = expense.name;
            document.getElementById("expense-amount").value = expense.amount;
            document.getElementById("expense-category").value = expense.category;
            document.getElementById("expense-date").value = expense.date;

            expenses = expenses.filter(exp => exp.id !== id);
            saveExpenses();
            displayExpenses(expenses);
            updateTotalAmount();
        }
    });

    filterCategory.addEventListener("change", (e) => {
        const category = e.target.value;
        if (category === "All") {
            displayExpenses(expenses);
        } else {
            displayExpenses(expenses.filter(exp => exp.category === category));
        }
    });

    function displayExpenses(list) {
        expenseList.innerHTML = "";
        list.forEach(expense => {
            expenseList.innerHTML += `
                <tr>
                    <td>${expense.name}</td>
                    <td>₱${expense.amount.toFixed(2)}</td>
                    <td>${expense.category}</td>
                    <td>${expense.date}</td>
                    <td>
                        <button type="button" class="edit-btn" data-id="${expense.id}">Edit</button>
                        <button type="button" class="delete-btn" data-id="${expense.id}">Delete</button>
                    </td>
                </tr>
            `;
        });
    }

    function updateTotalAmount() {
        const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
        totalAmount.textContent = total.toFixed(2);
    }

    loadExpenses();
});
