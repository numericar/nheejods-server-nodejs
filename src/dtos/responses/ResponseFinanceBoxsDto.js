class ResponseFinanceBoxsDto {

    constructor (id, title, income, expense, remaining, expensePercent) {
        this.id = id;
        this.title = title;
        this.income = income;
        this.expense = expense;
        this.remaining = remaining,
        this.expensePercent = expensePercent;
    }

}

module.exports = ResponseFinanceBoxsDto;