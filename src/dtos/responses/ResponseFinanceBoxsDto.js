class ResponseFinanceBoxsDto {

    constructor (title, income, expense, remaining, expensePercent) {
        this.title = title;
        this.income = income;
        this.expense = expense;
        this.remaining = remaining,
        this.expensePercent = expensePercent;
    }

}

module.exports = ResponseFinanceBoxsDto;