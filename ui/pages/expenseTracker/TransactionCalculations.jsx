export const calculateTotals = (transactions) => {
  let totalIncome = 0;
  let totalExpense = 0;
  const categoryTotals = {};

  transactions.forEach(transaction => {
    if (transaction.amount > 0) {
      totalIncome += transaction.amount;
    } else {
      totalExpense += transaction.amount;
    }

    if (!categoryTotals[transaction.category]) {
      categoryTotals[transaction.category] = 0;
    }
    categoryTotals[transaction.category] += transaction.amount;
  });

  // Calculate the balance
  const balance = totalIncome + totalExpense;

  return {
    totalIncome,
    totalExpense,
    balance,
    categoryTotals,
  };
};
