/**
 * 
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

export function setData(data) {
    localStorage.setItem('expenses', JSON.stringify(data));
}

export function getData() {
    return JSON.parse(localStorage.getItem('expenses'));
}