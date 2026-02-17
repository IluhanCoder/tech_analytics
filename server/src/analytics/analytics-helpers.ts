export function incrementDateByOneMonth(dateString: string): string {
    // Split the date string into year and month parts
    const [year, month] = dateString.split('-').map(Number);
  
    // Create a Date object with the provided year and month
    const currentDate = new Date(year, month - 1); // Subtract 1 from month since it's 0-based
  
    // Add one month to the current date
    currentDate.setMonth(currentDate.getMonth() + 1);
  
    // Extract the updated year and month
    const updatedYear = currentDate.getFullYear();
    const updatedMonth = currentDate.getMonth() + 1; // Add 1 back to month to match the format
  
    // Format the updated year and month as "YYYY-MM" and return it
    const updatedDateString = `${updatedYear}-${updatedMonth.toString().padStart(2, '0')}`;
    
    return updatedDateString;
  }

export function fillMissingMonths(data: any, field: string, start: string, end: string) {
  const startDate = new Date(start + '-01');
  const endDate = new Date(incrementDateByOneMonth(end) + '-01');
  const result = [];
  let currentDate = startDate;

  while (currentDate <= endDate) {

    const currentYear = currentDate.getFullYear();
    const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Zero-padding
    const currentMonthStr = `${currentYear}-${currentMonth}`; // "yyyy-mm" format
    const existingData = data.find((item: any) => item.month === currentMonthStr);

    if (existingData) {
      result.push(existingData);
    } else {
      if (field === "transactionCostsSum") result.push({ month: currentMonthStr, transactionCostsSum: 0 });
      if (field === "averageTransaction") result.push({ month: currentMonthStr, averageCost: 0 })
      if (field === "monthlyTransactionSum") result.push({ month: currentMonthStr, transactionCostsSum: 0 })
      if (field === "monthlyTransactions") result.push({ month: currentMonthStr, transactions: 0 })
      if (field === "monthlyProductSales") result.push({ month: currentMonthStr, productSales: 0 })
    }

    if(currentDate.getMonth() + 1 >= 12) {
      currentDate.setFullYear(currentYear + 1);
      currentDate.setMonth(0);
    }
    else currentDate.setMonth(currentDate.getMonth() + 1); // Move to the next month
  }

  return result;
}