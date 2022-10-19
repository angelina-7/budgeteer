import {
    STORAGE_EXPENSES_KEY, categories,
    e, tr, td,
    setData, getData, getId
} from './util';


let editMode = false;
let currId = null;

const store = getData(STORAGE_EXPENSES_KEY);

const form = document.getElementById('new-expense');
const tbody = document.querySelector('tbody');

hidrate(store);

form.addEventListener('submit', onFormSubmit);
form.querySelector('[type="reset"]').addEventListener('click', onFormCancel);

tbody.addEventListener('click', onRowBtnClick);

function hidrate(store) {
    if (store.length != 0) {
        for (const [key, value] of store) {
            const row = createExpenseRow(value);
            tbody.appendChild(row);
        }
    }
}

function onFormSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);

    if (Object.values(data).every(x => x)) {

        const id = editMode ? currId : getId();

        const expense = {
            id,
            ...data
        };
        store.set(expense.id, expense)

        const row = createExpenseRow(expense);

        if (editMode) {
            const oldRow = document.getElementById(id);
            tbody.replaceChild(row, oldRow);
            editMode = false;
            currId = null;
        } else {
            tbody.appendChild(row);
        }

        form.reset();
        setData(store, STORAGE_EXPENSES_KEY);

    } else {
        alert("All fields must be filled.");
    }

};

function onFormCancel(event) {
    editMode = false;
    currId = null;
}

function onRowBtnClick(event) {
    if (event.target.tagName == 'BUTTON') {
        const row = event.target.parentElement.parentElement;
        if (event.target.classList.contains('editBtn')) {
            editExpense(row);
        } else if (event.target.classList.contains('deleteBtn')) {
            deleteExpense(row);
        }
    }
};


function editExpense(row) {
    const expense = store.get(row.id);
    form.querySelector('[name="date"]').value = expense.date;
    form.querySelector('[name="name"]').value = expense.name;
    form.querySelector('[name="category"]').value = expense.category;
    form.querySelector('[name="amount"]').value = expense.amount;

    editMode = true;
    currId = row.id;

}

function deleteExpense(row) {
    if (confirm("Are you sure you want to DELETE this Expense?")) {
        row.remove();
        store.delete(row.id);
    }
}

function createExpenseRow(expense) {
    const { id, date, name, category, amount } = expense;

    const parsedDate = new Date(date);
    const strDate = `${parsedDate.getDate()}.${parsedDate.toLocaleString('en-us', { month: 'short' })}`

    let row = tr(
        td(strDate),
        td(name),
        td(categories[Number(category)]),
        td(e('span', { className: 'currency' }, amount)),
        td(e('button', { className: 'editBtn' }, "Edit"), e('button', { className: 'deleteBtn' }, "Delete"))
    );
    row.id = id;

    return row;
}
