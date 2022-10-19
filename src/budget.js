import { e, tr, td } from './util';

const form = document.getElementById('new-budget');
const tbody = document.querySelector('tbody');

form.addEventListener('submit', onFormSubmit);

function onFormSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);

    const row = createBudgetRow(data);
    tbody.appendChild(row);


}

function createBudgetRow(data) {
    const { month, income, budget } = data;

    const monthIndex = Number(month.slice(0,2)) -1;
    const parsedDate = new Date (month.slice(-4), monthIndex);
    const strDate = `${parsedDate.toLocaleString('en-us', { month: 'short' })}.${parsedDate.getFullYear()}`

    let row = tr(
        td(strDate),
        td(e('span', {className: 'currency'}, income)),
        td(e('span', {className: 'currency'}, budget)),
        td(e('button', { className: 'editBtn' }, "Edit"), e('button', { className: 'deleteBtn' }, "Delete"))
    );

    return row;
}
