class ResponseFinanceBoxDto {

    constructor(title, income, expense, remaining, incomeItems, expenseItems) {
        this.title = title;
        this.income = income;
        this.expense = expense;
        this.remaining = remaining;
        this.incomeItems = incomeItems;
        this.expenseItems = expenseItems;
    }

}

module.exports = ResponseFinanceBoxDto;