import { 
    STORAGE_BUDGETS_KEY, STORAGE_EXPENSES_KEY,
    getData
} from "./util";

const expenses = getData(STORAGE_EXPENSES_KEY);
const budgets = getData(STORAGE_BUDGETS_KEY);

const date = new Date();
const thisMonth = date.getMonth();

