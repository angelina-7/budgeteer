import {
    STORAGE_BUDGETS_KEY,
    e, tr, td,
    hidrate, setData, getData, getId
} from './util';


let editMode = false;
let currId = null;

const store = getData(STORAGE_BUDGETS_KEY);

const form = document.getElementById('new-budget');
const tbody = document.querySelector('tbody');

hidrate(store, createBudgetRow, tbody)

form.addEventListener('submit', onFormSubmit);
form.querySelector('[type="reset"]').addEventListener('click', onFormCancel);

tbody.addEventListener('click', onRowBtnClick)

function onFormSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);

    if (Object.values(data).every(x => x)) {

        const id = editMode ? currId : getId();

        const budget = {
            id,
            ...data
        };
        store.set(budget.id, budget)

        const row = createBudgetRow(budget);

        if (editMode) {
            const oldRow = document.getElementById(id);
            tbody.replaceChild(row, oldRow);
            editMode = false;
            currId = null;
        } else {
            tbody.appendChild(row);
        }

        form.reset();
        setData(store, STORAGE_BUDGETS_KEY);

    } else {
        alert("All fields must be filled.");
    }

}

function onFormCancel(event) {
    editMode = false;
    currId = null;
}

function onRowBtnClick(event) {
    if (event.target.tagName == 'BUTTON') {
        const row = event.target.parentElement.parentElement;
        if (event.target.classList.contains('editBtn')) {
            editBudget(row);
        } else if (event.target.classList.contains('deleteBtn')) {
            deleteBudget(row);
        }
    }
}


function editBudget(row) {
    const budget = store.get(row.id);
    console.log(budget);
    form.querySelector('[name="month"]').value = budget.month;
    form.querySelector('[name="income"]').value = budget.income;
    form.querySelector('[name="budget"]').value = budget.budget;

    editMode = true;
    currId = row.id;
}

function deleteBudget(row) {
    if (confirm("Are you sure you want to DELETE this Budget?")) {
        row.remove();
        store.delete(row.id);
    }
}

function createBudgetRow(data) {
    const { id, month, income, budget } = data;

    const monthIndex = Number(month.slice(0, 2)) - 1;
    const parsedDate = new Date(month.slice(-4), monthIndex);
    const strDate = `${parsedDate.toLocaleString('en-us', { month: 'short' })}.${parsedDate.getFullYear()}`

    let row = tr(
        td(strDate),
        td(e('span', { className: 'currency' }, income)),
        td(e('span', { className: 'currency' }, budget)),
        td(e('button', { className: 'editBtn' }, "Edit"), e('button', { className: 'deleteBtn' }, "Delete"))
    );
    row.id = id;

    return row;
}
