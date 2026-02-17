import UnifiedLoadingScreen from "../components/UnifiedLoadingScreen";
import { useEffect, useState } from "react";
import {
  Purchase,
  PurchaseResponse,
  Transaction,
  TransactionResponse,
} from "./transaction-types";
import transactionService from "./transaction-service";
import { DatePicker, TimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Box } from '@mui/material';
import { cardStyle } from "../styles/card-styles";
import { inputStyle } from "../styles/form-styles";
import { buttonStyle, deleteButtonStyle } from "../styles/button-styles";
import DateFormater from "../misc/date-formatter";
import { ToastContainer, toast } from "react-toastify";
import { Link } from "react-router-dom";

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState<TransactionResponse[]>();
  const [productName, setProductName] = useState<string>("");
  // Set default date range to current year
  const currentYear = new Date().getFullYear();
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    new Date(`${currentYear}-01-01T00:00:00`),
    new Date(`${currentYear}-12-31T23:59:59`)
  ]);
  const [startTime, setStartTime] = useState<Date | null>(new Date(`${currentYear}-01-01T00:00:00`));
  const [endTime, setEndTime] = useState<Date | null>(new Date(`${currentYear}-12-31T23:59:59`));

  const filterTransactions = async (stDate: Date, enDate: Date) => {
    try {
      const dateFilter = {
        date: {
          gte: stDate,
          lte: enDate,
        },
      };
      const result = await transactionService.fetchTransactions(
        dateFilter,
        productName,
      );
      setTransactions([...result]);
  } catch(error: any) {
    if(error.status = 401) toast.error("ви маєете бути авторизованими!");
    else toast.error(error.message);
  }
  };


  const handleDelete = async (transactionId: string) => {
    await transactionService.deleteTransactions(transactionId);
    toast.success("транзакцію успішно видалено");
    if (dateRange[0] && dateRange[1] && startTime && endTime) {
      const start = new Date(dateRange[0]);
      start.setHours(startTime.getHours(), startTime.getMinutes());
      const end = new Date(dateRange[1]);
      end.setHours(endTime.getHours(), endTime.getMinutes());
      filterTransactions(start, end);
    }
  };

  function formatDateTime(date: Date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }

  useEffect(() => {
    if (dateRange[0] && dateRange[1] && startTime && endTime) {
      const start = new Date(dateRange[0]);
      start.setHours(startTime.getHours(), startTime.getMinutes());
      const end = new Date(dateRange[1]);
      end.setHours(endTime.getHours(), endTime.getMinutes());
      filterTransactions(start, end);
    }
  }, []);

  return (
    <div className="flex flex-col">
      <ToastContainer />
      {/* Add button will be moved below filter bar */}
      <div className="flex justify-center">
        <div className={"flex flex-col justify-center gap-2 p-4 " + cardStyle}>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={4} alignItems="center" justifyContent="center">
                  <DatePicker
                    label="Від"
                    value={dateRange[0]}
                    onChange={(newValue) => setDateRange([newValue, dateRange[1]])}
                    slotProps={{ textField: { className: inputStyle + " w-32" } }}
                  />
                  <DatePicker
                    label="До"
                    value={dateRange[1]}
                    onChange={(newValue) => setDateRange([dateRange[0], newValue])}
                    slotProps={{ textField: { className: inputStyle + " w-32" } }}
                  />
                  <TimePicker
                    label="Час від"
                    value={startTime}
                    onChange={setStartTime}
                    slotProps={{ textField: { className: inputStyle + " w-24 mt-1" } }}
                  />
                  <TimePicker
                    label="Час до"
                    value={endTime}
                    onChange={setEndTime}
                    slotProps={{ textField: { className: inputStyle + " w-24 mt-1" } }}
                  />
                </Box>
              </LocalizationProvider>
            </div>
            <div className="flex flex-row items-center gap-3 px-2 py-1 w-full">
              <label className="min-w-[180px] text-gray-700 text-sm font-medium whitespace-nowrap">Назва товару в замовленні:</label>
              <input
                className={inputStyle + " max-w-xs flex-1"}
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="Введіть назву товару"
              />
            </div>
          </div>
          <div className="flex justify-center">
            <button
              type="button"
              className={buttonStyle}
              onClick={() => {
                if (dateRange[0] && dateRange[1] && startTime && endTime) {
                  const start = new Date(dateRange[0]);
                  start.setHours(startTime.getHours(), startTime.getMinutes());
                  const end = new Date(dateRange[1]);
                  end.setHours(endTime.getHours(), endTime.getMinutes());
                  filterTransactions(start, end);
                }
              }}
            >
              знайти
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-col p-4">
        {(transactions &&
          ((transactions.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
              {transactions.map((transaction: TransactionResponse) => (
                <div
                  className="bg-white/70 backdrop-blur-xl border border-amber-100 rounded-3xl shadow-xl p-6 flex flex-col gap-4 hover:shadow-2xl transition-shadow duration-200"
                  key={transaction.id}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg font-bold text-amber-700 drop-shadow-sm">Замовлення #{transaction.id.slice(-5)}</span>
                    <span className="text-xs text-gray-400 font-mono">{formatDateTime(new Date(transaction.date))}</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="text-xs text-gray-500 tracking-wide mb-1">Куплені товари:</div>
                    <ul className="divide-y divide-amber-100">
                      {transaction.products.map((prod: PurchaseResponse, idx) => (
                        <li key={prod.productId + idx} className="flex items-center justify-between py-2 px-2 rounded-xl hover:bg-amber-50/60 transition">
                          {prod.product ? (
                            <>
                              <span className="font-medium text-gray-900 flex-1">{prod.product.name}</span>
                              <span className="text-gray-500 text-xs mx-2">×{prod.quantity}</span>
                              <span className="text-amber-600 font-semibold text-sm">{prod.product.price} грн</span>
                            </>
                          ) : (
                            <span className="italic text-gray-400 flex-1">продукту не існує або видалено</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex items-center justify-between gap-2 pt-2 px-1 border-t border-amber-100 mt-2">
                    <span className="text-sm text-gray-500">Сума замовлення:</span>
                    <span className="font-bold text-lg text-amber-700">{transaction.totalCost} грн</span>
                  </div>
                  <div className="flex justify-end pt-2">
                    <button
                      className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/80 border border-red-200 hover:bg-red-50 hover:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-200 transition-all duration-150 shadow-sm text-xs"
                      type="button"
                      aria-label="Видалити замовлення"
                      onClick={() => handleDelete(transaction.id)}
                    >
                      <span className="text-red-500 font-medium">видалити</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )) || (
            <div className="flex justify-center">
              <div className="mt-16 text-center text-2xl text-gray-400 font-light">
                Замовлення відсутні
              </div>
            </div>
          ))) || (
          <UnifiedLoadingScreen label="Підвантаження транзакцій..." />
        )}
        <div className="flex justify-center py-6">
          <Link
            to="/new-transaction"
            className="inline-flex items-center rounded-full bg-amber-500 text-white font-bold px-6 py-2 shadow-lg hover:bg-amber-600 focus:outline-none focus:ring-4 focus:ring-amber-200 transition-all duration-150 text-base border-2 border-amber-300"
          >
            Додати нове замовлення
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TransactionsPage;
