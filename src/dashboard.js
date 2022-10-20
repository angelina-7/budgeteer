import {
    STORAGE_BUDGETS_KEY, STORAGE_EXPENSES_KEY, categories,
    e, getData, currMonthBudget, currMonthExpenses, sumCurrMonthExpByCategory
} from "./util";

const expenses = getData(STORAGE_EXPENSES_KEY);
const budgets = getData(STORAGE_BUDGETS_KEY);

const today = new Date();
const thisMonthBudget = currMonthBudget(budgets, today.getMonth(), today.getFullYear());
const thisMonthExpenses = currMonthExpenses(expenses, today.getMonth(), today.getFullYear());

makeOverview();
makeBreakdown();

function makeOverview() {
    let spent = thisMonthExpenses.reduce((acc, curr) => acc + curr.amount, 0);
    let remaining = thisMonthBudget.budget - spent;
    let savings = thisMonthBudget.income - thisMonthBudget.budget;
    let allMoney = spent + remaining + savings;

    const spentBar = document.querySelector('.ov.spent');
    const remainingBar = document.querySelector('.ov.remain');
    const savingsBar = document.querySelector('.ov.save');

    let spentPX = (spent / allMoney * 300 | 0);
    if (remaining < 0) {
        remaining = Math.abs(remaining);
        savings = thisMonthBudget.income - spent;
        allMoney = spent + savings;

        remainingBar.className = "ov remain-minus"
        spentPX = ((spent - remaining) / allMoney * 300 | 0);
        document.getElementById('remaining-label').textContent = "Overruns"
    }

    document.getElementById('spent').textContent = spent;
    document.getElementById('remaining').textContent = remaining;
    document.getElementById('savings').textContent = savings;

    spentBar.style.height = spentPX + 'px';
    remainingBar.style.height = (remaining / allMoney * 300 | 0) + 'px';
    savingsBar.style.height = (savings / allMoney * 300 | 0) + 'px';

}

function makeBreakdown() {
    const breakdownSection = document.getElementById('breakdown');

    let catSums = sumCurrMonthExpByCategory(thisMonthExpenses);
    let sumAll = catSums.reduce((acc, curr) => acc + curr, 0);

    for (let i = 0; i < categories.length; i++) {
        const width = (catSums[i] / sumAll * 400);
        const row = createCategoryRow(catSums[i], categories[i], width);
        breakdownSection.appendChild(row);
    }
}


function createCategoryRow(catSum, category, width) {
    const bar = e('span', { className: 'bar' });
    bar.style.width = width + 'px';

    const row = e('div', { className: 'cat-row' },
        e('span', { className: 'row label' }, category),
        e('span', { className: 'row value' }, catSum),
        e('div', { className: 'bar-area' }, bar)
    );

    return row;
}