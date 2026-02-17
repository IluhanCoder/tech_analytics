import { useState } from "react";
import RangePicker from "./search-bar-components/range-picker";
import { ProductFilter } from "./product-types";
import categoriesArray from "../misc/categories-array";

type LocalParams = {
  onSubmit: (filter: ProductFilter) => {};
};

const ProductSearchBar = (params: LocalParams) => {
  const minState = useState<number>(0);
  const maxState = useState<number>(0);

  const [category, setCategory] = useState<string>("");
  const [name, setName] = useState<string>("");

  const { onSubmit } = params;

  const handleSubmit = () => {
    const filter: ProductFilter = {};
    if (!(minState[0] === 0 && maxState[0] === 0))
      filter.price = {
        gt: minState[0],
        lt: maxState[0],
      };
    if (name.length > 0) {
      filter["name"] = { contains: name };
    }
    if (category.length > 0) {
      filter["category"] = { contains: category };
    }
    onSubmit(filter);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg px-3 py-2">
      <form className="flex flex-wrap items-center gap-2 w-full">
        <input
          id="search-name"
          className="appearance-none w-48 px-2.5 py-2 rounded-md border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-amber-300 focus:border-amber-400 transition text-sm h-9"
          type="text"
          value={name}
          placeholder="Пошук товару"
          onChange={(e) => setName(e.target.value)}
        />
        <select
          id="search-category"
          className="appearance-none w-40 px-2.5 py-2 rounded-md border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-amber-300 focus:border-amber-400 transition text-sm h-9"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Категорія</option>
          {categoriesArray.map((cat: string) => <option key={cat} value={cat}>{cat}</option>)}
        </select>
        <div className="flex items-center gap-2 ml-auto">
          <div className="flex flex-row items-center gap-2 px-1 h-9">
            <span className="text-gray-600 text-sm">Ціна</span>
            <RangePicker minState={minState} maxState={maxState} />
          </div>
          <button
            className="inline-flex items-center justify-center h-9 px-3 rounded-md border border-amber-300 text-amber-700 hover:bg-amber-50 transition-colors text-sm"
            type="button"
            onClick={handleSubmit}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 mr-1"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" /></svg>
            Знайти
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductSearchBar;
