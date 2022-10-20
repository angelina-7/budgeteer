import {
    STORAGE_EXPENSES_KEY, STORAGE_BUDGETS_KEY, categories,
    e, tr, td,
    getData, currMonthExpenses, sumCurrMonthExpByCategory
} from "./util";

const expenses = getData(STORAGE_EXPENSES_KEY);
const budgets = getData(STORAGE_BUDGETS_KEY);

const today = new Date();

const thisMonthExp = currMonthExpenses(expenses, today.getMonth(), today.getFullYear());
const lastMonthExp = currMonthExpenses(expenses, today.getMonth() - 1, today.getFullYear());
const prevMonthExp = currMonthExpenses(expenses, today.getMonth() - 2, today.getFullYear());

const thead = document.querySelector('thead > tr');
const tbody = document.querySelector('tbody');

makeSummary();


function makeSummary() {
    createMonthHeads(today);
    thead.appendChild(e('th', {}, "Total"));


    fillMonthColumns();
}

function createMonthHeads(date) {
    date.setMonth(date.getMonth() - 2);

    for (let i = 0; i < 3; i++) {
        const col = e('th', {}, date.toLocaleString('en-us', { month: 'short' }));
        thead.appendChild(col);

        date.setMonth(date.getMonth() + 1);
    }
}

function fillMonthColumns() {
    const sumsMo1 = sumCurrMonthExpByCategory(prevMonthExp);
    const sumsMo2 = sumCurrMonthExpByCategory(lastMonthExp);
    const sumsMo3 = sumCurrMonthExpByCategory(thisMonthExp);

    for (let i = 0; i < categories.length; i++) {
        const total  = sumsMo1[i] + sumsMo2[i] + sumsMo3[i]
        const row = createCategoryRow(categories[i], [sumsMo1[i], sumsMo2[i], sumsMo3[i]], total)
        tbody.appendChild(row);
    }
}

function createCategoryRow(catName, amount, total) {
    const row = tr(
        e('th', {}, catName),
        td(e('span', { className: 'currency' }, amount[0])),
        td(e('span', { className: 'currency' }, amount[1])),
        td(e('span', { className: 'currency' }, amount[2])),
        e('th', {}, e('span', { className: 'currency' }, total))
    );

    return row;
}
