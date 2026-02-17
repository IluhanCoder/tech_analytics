import { deleteButtonStyle } from "../styles/button-styles";
import { cardStyle } from "../styles/card-styles";
import { Characteristic } from "./product-types";

type Params = {
  characteristics: Array<Characteristic>;
  onRemove?: Function;
};

const CharacteristicsMapper = (params: Params) => {
  const { characteristics, onRemove } = params;

  const handleRemove = (index: number) => {
    if (!onRemove) return;
    const temp = characteristics;
    temp.splice(index, 1);
    onRemove(temp);
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-100 bg-white/80 shadow-sm">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-gray-50 text-gray-500 uppercase text-xs tracking-wider">
            <th className="px-4 py-2 text-left font-semibold">Ключ</th>
            <th className="px-4 py-2 text-left font-semibold">Значення</th>
            {onRemove && <th className="px-2 py-2"></th>}
          </tr>
        </thead>
        <tbody>
          {characteristics.map((item: Characteristic, idx) => (
            <tr key={item.key} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
              <td className="px-4 py-2 text-gray-700 max-w-[140px] truncate align-middle">{item.key}</td>
              <td className="px-4 py-2 text-gray-900 font-medium max-w-[180px] truncate align-middle">{item.value}</td>
              {onRemove && (
                <td className="px-2 py-2 align-middle">
                  <button
                    className="flex items-center justify-center w-6 h-6 rounded-full bg-red-100 hover:bg-red-200 text-red-500 transition-colors focus:outline-none focus:ring-2 focus:ring-red-200"
                    type="button"
                    title="Видалити характеристику"
                    onClick={() => handleRemove(characteristics.indexOf(item))}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CharacteristicsMapper;
