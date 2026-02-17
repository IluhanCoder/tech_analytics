import { useState } from "react";
import { ITransaction, Purchase, Transaction } from "./transaction-types";
import transactionService from "./transaction-service";
import ProductsCatalogue from "../products/products-catalogue";
import { IProduct, Product } from "../products/product-types";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import TextField from '@mui/material/TextField';

type ProductToDisplay = {
  id: string;
  name: string;
  quantity: number;
};

const NewTransactionPage = () => {
  const [date, setDate] = useState<Date | null>(new Date());
  const [productsToDisplay, setProductsToDisplay] = useState<
    ProductToDisplay[]
  >([]);
  const navigate = useNavigate();

  const handlePush = async (product: Product) => {
    const productToDisplay = {
      id: product.id,
      name: product.name,
      quantity: 1,
    };
    if (
      productsToDisplay.some(
        (product: ProductToDisplay) => product.id === productToDisplay.id,
      )
    )
      return;
    setProductsToDisplay([...productsToDisplay, productToDisplay]);
  };

  const handleSubmit = async () => {
    if (!date) {
      toast.error("Оберіть дату та час замовлення");
      return;
    }
    try {
      const products: Purchase[] = [];
      productsToDisplay.map((product: ProductToDisplay) => {
        products.push({ productId: product.id, quantity: product.quantity });
      });
      const newTransaction: ITransaction = {
        date: date as Date,
        products,
      };
      toast("обробка запиту...");
      await transactionService.createTransaction(newTransaction);
      toast.success("транзацію успішно створено");
      setProductsToDisplay([]);
    } catch(error: any) {
      if(error.status = 401) toast.error("ви маєете бути авторизованими!");
      else toast.error(error.message);
    }
  };

  const handleQuantityChange = (e: any) => {
    const { id, value } = e.target;
    const tempArray = productsToDisplay;
    const index = tempArray.findIndex(
      (element: ProductToDisplay) => element.id === id,
    );
    productsToDisplay[index].quantity = Number(value);
    setProductsToDisplay([...tempArray]);
  };

  const handleDelete = (index: number) => {
    const temp = productsToDisplay;
    temp.splice(index, 1);
    setProductsToDisplay([...temp]);
  };

  // No need for custom time change handler, handled by MUI TimePicker

  return (
    <main className="flex flex-col items-center justify-center min-h-[80vh] px-1 py-4 bg-gradient-to-br from-white to-amber-50">
      <section className="w-full max-w-5xl bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl p-6 flex flex-col gap-4 border border-amber-100 mt-4">
        <ToastContainer />
        <h1 className="text-2xl font-extrabold text-amber-600 text-center tracking-tight mb-1 drop-shadow-sm">Додавання нового замовлення</h1>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <div className="flex flex-col md:flex-row gap-3 md:items-end items-center justify-between">
            <div className="flex-1 w-full flex flex-col justify-end">
              <label className="block text-sm font-medium text-gray-700 mb-1">Дата та час замовлення</label>
              <div className="flex gap-4">
                <DatePicker
                  value={date}
                  onChange={setDate}
                  slotProps={{
                    textField: {
                      className: "w-full px-4 py-2 rounded-xl border border-amber-200 bg-white/80 focus:ring-2 focus:ring-amber-400 focus:outline-none transition text-base shadow-sm"
                    }
                  }}
                />
                <TimePicker
                  value={date}
                  onChange={setDate}
                  slotProps={{
                    textField: {
                      className: "w-full px-4 py-2 rounded-xl border border-amber-200 bg-white/80 focus:ring-2 focus:ring-amber-400 focus:outline-none transition text-base shadow-sm"
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </LocalizationProvider>
        <div className="flex flex-col gap-2">
          <div className="text-xl font-semibold text-amber-700 text-center">Товари у замовленні</div>
          <div className="overflow-x-auto w-full max-w-4xl mx-auto">
            {(productsToDisplay.length > 0 && (
              <table className="min-w-full bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl border border-amber-100">
                <thead>
                  <tr className="text-lg text-amber-700 bg-amber-50">
                    <th className="p-4 font-semibold rounded-tl-2xl">Товар</th>
                    <th className="p-4 font-semibold">Кількість</th>
                    <th className="p-4 font-semibold rounded-tr-2xl">Дія</th>
                  </tr>
                </thead>
                <tbody>
                  {productsToDisplay.map((product: ProductToDisplay, i: number) => (
                    <tr key={i} className="even:bg-amber-50/40 hover:bg-amber-100/40 transition">
                      <td className="p-3 border-b border-amber-100 text-center text-gray-800 font-medium">{product.name}</td>
                      <td className="p-3 border-b border-amber-100 text-center">
                        <input
                          className="w-20 px-2 py-1 rounded-lg border border-amber-200 bg-white/80 focus:ring-2 focus:ring-amber-400 focus:outline-none transition text-base shadow-sm text-center"
                          min={1}
                          id={product.id}
                          type="number"
                          value={product.quantity}
                          onChange={handleQuantityChange}
                        />
                      </td>
                      <td className="p-3 border-b border-amber-100 text-center">
                        <button
                          className="px-4 py-1 rounded-lg bg-red-100 hover:bg-red-200 text-red-700 font-semibold transition"
                          onClick={() => handleDelete(i)}
                          type="button"
                        >
                          Прибрати
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )) || (
              <div className="text-center text-gray-500 py-4">Ви поки що не додали жодного товару до замовлення</div>
            )}
          </div>
        </div>
        <div className="flex justify-center">
          <button className="px-8 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed" type="button" onClick={handleSubmit}>
            Додати замовлення
          </button>
        </div>
        <div className="flex flex-col gap-2 mt-10">
          <div className="text-center text-xl text-gray-700">
            Оберіть товари, що входитимуть до замовлення:
          </div>
          <ProductsCatalogue isPicker onPick={handlePush} />
        </div>
      </section>
    </main>
  );
};

export default NewTransactionPage;
