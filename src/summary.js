import {
    STORAGE_EXPENSES_KEY, STORAGE_BUDGETS_KEY, categories,
    e, tr, td,
    getData, currMonthExpenses, sumCurrMonthExpByCategory, currMonthBudget
} from "./util";

const expenses = getData(STORAGE_EXPENSES_KEY);
const budgets = getData(STORAGE_BUDGETS_KEY);

const today = new Date();

const thisMonthExp = currMonthExpenses(expenses, today.getMonth(), today.getFullYear());
const lastMonthExp = currMonthExpenses(expenses, today.getMonth() - 1, today.getFullYear());
const prevMonthExp = currMonthExpenses(expenses, today.getMonth() - 2, today.getFullYear());

const thisMonthBudget = currMonthBudget(budgets, today.getMonth(), today.getFullYear());
const lastMonthBudget = currMonthBudget(budgets, today.getMonth() - 1, today.getFullYear());
const prevMonthBudget = currMonthBudget(budgets, today.getMonth() - 2, today.getFullYear());

const thead = document.querySelector('thead > tr');
const tbody = document.querySelector('tbody');

makeSummary();


function makeSummary() {
    createMonthHeads(today);
    thead.appendChild(e('th', {}, "Total"));

    const sumsMo1 = sumCurrMonthExpByCategory(prevMonthExp);
    const sumsMo2 = sumCurrMonthExpByCategory(lastMonthExp);
    const sumsMo3 = sumCurrMonthExpByCategory(thisMonthExp);

    fillMonthColumns(sumsMo1, sumsMo2, sumsMo3);

    const totalMo1 = sumsMo1.reduce((acc, curr) => acc + curr, 0);
    const totalMo2 = sumsMo2.reduce((acc, curr) => acc + curr, 0);
    const totalMo3 = sumsMo3.reduce((acc, curr) => acc + curr, 0);

    fillBudgetReportColumns([totalMo1, totalMo2, totalMo3], [prevMonthBudget, lastMonthBudget, thisMonthBudget])
}

function createMonthHeads(date) {
    date.setMonth(date.getMonth() - 2);

    for (let i = 0; i < 3; i++) {
        const col = e('th', {}, date.toLocaleString('en-us', { month: 'short' }));
        thead.appendChild(col);

        date.setMonth(date.getMonth() + 1);
    }
}

function fillMonthColumns(sumsMo1, sumsMo2, sumsMo3) {
    for (let i = 0; i < categories.length; i++) {
        const total = sumsMo1[i] + sumsMo2[i] + sumsMo3[i]
        const row = createCategoryRow(categories[i], [sumsMo1[i], sumsMo2[i], sumsMo3[i]], total)
        tbody.appendChild(row);
    }
}

function fillBudgetReportColumns(totalMo, budgetMo) {
    const total = document.querySelector('.total');
    const overrun = document.querySelector('.overrun');
    const savings = document.querySelector('.savings');

    let overrunMo = [0, 0, 0];
    let savingsMo = [0, 0, 0];
    for (let i = 0; i < 3; i++) {
        if (budgetMo[i]) {
            let savings = budgetMo[i].income - budgetMo[i].budget;
            let remain = budgetMo[i].budget - totalMo[i]
            if (remain < 0) {
                overrunMo[i] = Math.abs(remain);
                savings = budgetMo[i].income - totalMo[i];
            }
            savingsMo[i] = savings;
        }
    }
    const totalRow = createSummaryRow(totalMo[0], totalMo[1], totalMo[2]);

    const overrunRow = createSummaryRow(overrunMo[0], overrunMo[1], overrunMo[2]);

    const savingsRow = createSummaryRow(savingsMo[0], savingsMo[1], savingsMo[2]);

    for (let i = 0; i < totalRow.length; i++) {
        total.appendChild(totalRow[i]);
        overrun.appendChild(overrunRow[i]);
        savings.appendChild(savingsRow[i]);
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

function createSummaryRow(val1, val2, val3) {
    const sum = val1 + val2 + val3;
    const rowEls = [
        td(e('span', { className: 'currency' }, val1)),
        td(e('span', { className: 'currency' }, val2)),
        td(e('span', { className: 'currency' }, val3)),
        e('th', {}, e('span', { className: 'currency' }, sum))
    ]

    return rowEls
}