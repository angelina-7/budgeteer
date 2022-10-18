import { e, tr, td, categories, setData, getData } from './util';

let store = getData() || [];

const tbody = document.querySelector('tbody');
const form = document.getElementById('new-expense');


form.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);

    createRow(data);
    store.push(data);

    form.reset();

    setData(store);

});

function hidrate(store) {
    if (store.length != 0) {
        for (const item of store) {
            createRow(item)
        }
    }
}
hidrate(store);

function createRow(data) {
    if (!Object.values(data).every(x => x)) {
        return;
    }

    const { date, name, category, amount } = data;

    const parsedDate = new Date(date);
    const strDate = `${parsedDate.getDate()}.${parsedDate.toLocaleString('en-us', { month: 'short' })}`

    let row = tr(
        td(strDate),
        td(name),
        td(categories[Number(category)]),
        td(e('span', { className: 'currency' }, amount)),
        td(e('button', {}, "Edit"), e('button', {}, "Delete"))
    )

    tbody.appendChild(row);
}