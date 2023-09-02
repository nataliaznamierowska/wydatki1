document.addEventListener("DOMContentLoaded", function () {
  console.log("loaded");
});
let availableBalanceElement = document.getElementById("available-balance");
let totalIncomeElement = document.getElementById("total-income");
let totalExpenseElement = document.getElementById("total-expense");
let incomeList = document.getElementById("income-list");
let expenseList = document.getElementById("expense-list");
let addExpenseButton = document.getElementById("addExpenseButton");
let addIncomeButton = document.getElementById("addIncomeButton");
let items = [];
addIncomeButton.addEventListener("click", addItem);
addExpenseButton.addEventListener("click", addItem);

function loadItemValue(objectType) {
  let nameInput = {};
  let amountInput = {};

  if (objectType == "income") {
    nameInput = document.getElementById("income-name");
    amountInput = document.getElementById("income-amount");
  }

  if (objectType == "expense") {
    nameInput = document.getElementById("expense-name");
    amountInput = document.getElementById("expense-amount");
  }

  let name = nameInput.value;
  let amount = parseFloat(amountInput.value);
  let type = objectType;
  let id = "a" + Date.now();
  if (!name || isNaN(amount) || amount <= 0) {
    alert("Wprowadź poprawną nazwę");
  } else {
    items.push({ id: id, name: name, amount: amount, type: type });
    nameInput.value = "";
    amountInput.value = "";
  }
}

function addItem(event) {
  if (event.srcElement.id == "addIncomeButton") {
    loadItemValue("income");
  }
  if (event.target.id == "addExpenseButton") {
    loadItemValue("expense");
  }
  updateItems();
  updateBalance();
}

function deleteItem(id) {
  // console.log(id);
  items.splice(
    items.findIndex((item) => item.id == id),
    1
  );
  updateItems();
  updateBalance();
}

function showModal(id) {
  // console.log/(id);
  let modal = document.createElement("div");
  let itemElement = items.findIndex((item) => item.id == id);
  let nameElement = document.getElementsByClassName("i" + { id });
  modal.className = "modal";
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close-btn">&times;</span>
      <p id="modal-text">Editing item...</p>
      <input type="text" id="new-name" placeholder="Enter new name">
      <input type="number" id="new-amount" placeholder="Enter new amount">
      <button id="save-button">Save</button>
    </div>
  `;

  document.body.appendChild(modal);
  const modalText = document.getElementById("modal-text");
  const newNameInput = document.getElementById("new-name");
  const newAmountInput = document.getElementById("new-amount");
  const saveButton = document.getElementById("save-button");
  const closeButton = modal.querySelector(".close-btn");

  saveButton.addEventListener("click", () => {
    const newName = newNameInput.value;
    const newAmount = parseFloat(newAmountInput.value);

    if (newName && newAmount > 0 && !isNaN(newAmount)) {
      items[itemElement].name = newName;
      items[itemElement].amount = newAmount;
      updateItems();
      updateBalance();
      modal.style.display = "none";
    } else {
      modalText.innerText =
        "Invalid input. Please enter a valid name and amount.";
    }
  });

  nameElement.innerText = `${items[itemElement].name}: ${items[itemElement].amount} PLN`;

  closeButton.addEventListener("click", () => {
    modal.style.display = "none";
  });
}

function editItem(id) {
  let editedItemIndex = items.find((item) => item.id == id);
  let newName = "";
  let newAmount = 0;
  showModal(id);
}

function showItem(item) {
  // console.log('showing items: ');

  let listItem = document.createElement("li");
  let itemId = item.id;
  // console.log(item.id);
  let itemContent = document.createElement("span");
  itemContent.class = "i" + item.id;
  // itemContent = 'b' + item.id;
  itemContent.innerText = `${item.name}: ${item.amount} PLN`;
  // console.log(itemContent)
  listItem.appendChild(itemContent);

  let editButton = document.createElement("button");
  editButton.className = "edit-button";
  editButton.dataset.itemId = itemId;
  editButton.innerText = "Edit";
  listItem.appendChild(editButton);

  let deleteButton = document.createElement("button");
  deleteButton.className = "delete-button";
  deleteButton.dataset.itemId = itemId;
  deleteButton.innerText = "Delete";
  listItem.appendChild(deleteButton);

  if (item.type == "income") {
    incomeList.appendChild(listItem);
  } else if (item.type == "expense") {
    expenseList.appendChild(listItem);
  }

  let editButtonSelector = `.edit-button[data-item-id="${itemId}"]`;
  let deleteButtonSelector = `.delete-button[data-item-id="${itemId}"]`;

  // console.log(editButtonSelector);
  document
    .querySelector(editButtonSelector)
    .addEventListener("click", function () {
      editItem(itemId);
    });

  document
    .querySelector(deleteButtonSelector)
    .addEventListener("click", function () {
      deleteItem(itemId);
    });
}

function updateItems() {
  incomeList.innerHTML = "";
  expenseList.innerHTML = "";
  items.map(showItem);
}

function updateBalance() {
  let totalIncome = items
    .filter((item) => item.type == "income")
    .reduce((total, incomeItem) => total + incomeItem.amount, 0);
  let totalExpense = items
    .filter((item) => item.type == "expense")
    .reduce((total, expenseItem) => total + expenseItem.amount, 0);
  console.log("income: " + totalIncome);
  console.log("expense: " + totalExpense);
  totalIncomeElement.innerText = `${totalIncome.toFixed(2)} PLN`;
  totalExpenseElement.innerText = `${totalExpense.toFixed(2)} PLN`;
  let balance = (totalIncome - totalExpense).toFixed(2);

  if (balance > 0) {
    availableBalanceElement.innerText = `Możesz jeszcze wydać ${balance} PLN`;
  }
  if (balance == 0) {
    availableBalanceElement.innerText = "Bilans wynosi zero";
  }
  if (balance < 0) {
    availableBalanceElement.innerText = `Bilans jest ujemny. Jesteś na minusie ${Math.abs(
      balance
    )} PLN`;
  }
}

// Inicjalizacja listy przychodów i wydatków
updateItems();
updateBalance();
