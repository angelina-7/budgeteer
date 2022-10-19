const STORAGE_EXPENSES_KEY = 'expenses';

/**
 * @param {string} type 
 * @param {Object} attrtibutes 
 * @param  {...(string|Node)} content 
 * @returns {HTMLElement}
 */
export function e(type, attrtibutes, ...content) {
    const result = document.createElement(type);

    for (let key in attrtibutes) {
        if (key.startsWith('on')) {
            result.addEventListener(key.slice(2), attrtibutes[key]);
        } else {
            result[key] = attrtibutes[key];
        }
    }

    for (const item of content) {
        result.append(item);
    }

    return result;
}

export const tr = e.bind(null, 'tr', {});
export const td = e.bind(null, 'td', {});

export const categories = [
    "Other",
    "Utilities",
    "Groceries",
    "Entertainment",
    "Transport"
];

export function getId() {
    return ('00000000' + Math.random() * 99999999 | 0).toString(16).slice(-8);
}

export function setData(data) {
    const values = [...data.values()];
    localStorage.setItem(STORAGE_EXPENSES_KEY, JSON.stringify(values));
}

export function getData() {
    const values = JSON.parse(localStorage.getItem(STORAGE_EXPENSES_KEY));
    if (values) {
        return new Map(values.map(e => [e.id, e]));
    } else {
        return new Map();
    }
}