import { useEffect, useState } from "react";
import { Characteristic, IProduct } from "./product-types";
import CharacteristicsMapper from "./characteristics-mapper";
import productService, { newProductRequestData } from "./product-service";
import { cardStyle } from "../styles/card-styles";
import { buttonStyle, deleteButtonStyle } from "../styles/button-styles";
import { inputStyle } from "../styles/form-styles";
import { ToastContainer, toast } from "react-toastify";
import categoriesArray from "../misc/categories-array";


const NewProductPage = () => {
  const defaultImage = process.env.REACT_APP_IMAGE_PLACEHOLDER!;
  const defaultCharacteristic = { key: "", value: "" };
  const [imgURL, setImgURL] = useState<string>(defaultImage);
  const [name, setName] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  const [characteristics, setCharacteristics] = useState<Characteristic[]>([]);
  const [currentCharacteristic, setCurrentCharacteristic] = useState<Characteristic>(defaultCharacteristic);
  const [avatar, setAvatar] = useState<File | undefined>();
  const [avatarSet, setAvatarSet] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (avatar) {
      setImgURL(URL.createObjectURL(avatar));
    } else {
      setImgURL(defaultImage);
    }
  }, [avatar, defaultImage]);

  const handleCharacteristicLabel = (value: string) => {
    setCurrentCharacteristic((prev) => ({ ...prev, key: value }));
  };
  const handleCharacteristicValue = (value: string) => {
    setCurrentCharacteristic((prev) => ({ ...prev, value: value }));
  };
  const characteristicValidation = () => {
    if (!currentCharacteristic.key || !currentCharacteristic.value) {
      toast.error("Заповніть ключ і значення характеристики");
      throw new Error("Invalid characteristic");
    }
  };
  const handleCharacteristicPush = () => {
    try {
      characteristicValidation();
      setCharacteristics([...characteristics, currentCharacteristic]);
      setCurrentCharacteristic(defaultCharacteristic);
    } catch {}
  };
  const handleNewImage = (files: FileList | null) => {
    if (!files) return;
    const file: File = files[0];
    if (!file) return;
    setAvatar(file);
    setAvatarSet(true);
  };
  const dropImage = () => {
    setAvatar(undefined);
    setAvatarSet(false);
  };
  const dropInput = () => {
    setAvatar(undefined);
    setImgURL(defaultImage);
    setName("");
    setCategory("");
    setDescription("");
    setPrice(0);
    setCharacteristics([]);
    setCurrentCharacteristic(defaultCharacteristic);
    setAvatarSet(false);
  };
  const handleSubmit = async () => {
    try {
      if (!(name.length > 0 && description.length > 0 && category.length > 0 && characteristics.length > 0 && avatarSet)) {
        toast.error("Усі поля мають бути заповненими");
        return;
      }
      const newProduct: IProduct = {
        name,
        description,
        category,
        price,
        characteristics,
      };
      setIsLoading(true);
      await productService.newProduct(newProduct, avatar!);
      toast.success("товар було успішно створено");
      dropInput();
      setIsLoading(false);
    } catch (error: any) {
      if (error.status === 401) toast.error("ви маєете бути авторизованими!");
      else toast.error(error.message);
    }
  };

  return (
    <>
      <ToastContainer />
      {!isLoading && (
        <div className="flex flex-col items-center justify-center min-h-[90vh] py-8 px-2 bg-gradient-to-br from-gray-50 to-white">
          <div className="w-full max-w-2xl bg-white/80 backdrop-blur-md border border-gray-100 rounded-3xl shadow-2xl p-8 md:p-12 flex flex-col gap-8">
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 text-center mb-2 tracking-tight drop-shadow-sm">Новий продукт</h1>
            {/* Image Upload Section */}
            <div className="flex flex-col items-center gap-2 relative">
              <div className="relative w-40 h-40 mb-2 flex items-center justify-center bg-gray-100 rounded-2xl border-2 border-gray-200 shadow">
                {imgURL && imgURL !== defaultImage ? (
                  <img className="w-40 h-40 object-cover rounded-2xl" src={imgURL} alt="product avatar" />
                ) : (
                  <span className="flex flex-col items-center justify-center text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mb-2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5V6.75A2.25 2.25 0 015.25 4.5h13.5A2.25 2.25 0 0121 6.75v9.75M3 16.5V17.25A2.25 2.25 0 005.25 19.5h13.5A2.25 2.25 0 0021 17.25V16.5m-18 0a2.25 2.25 0 002.25 2.25h13.5A2.25 2.25 0 0021 16.5m-9-4.125a2.625 2.625 0 105.25 0 2.625 2.625 0 00-5.25 0z" />
                    </svg>
                    <span className="text-sm">Немає зображення</span>
                  </span>
                )}
                <label htmlFor="fileInput" className="absolute bottom-2 right-2 bg-gray-900 text-white rounded-full p-2 shadow-lg cursor-pointer hover:bg-gray-800 transition-colors" title="Завантажити зображення">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 16v-8m0 0l-3 3m3-3l3 3M4 20h16" />
                  </svg>
                  <input type="file" id="fileInput" className="hidden" onChange={(e) => handleNewImage(e.target.files)} />
                </label>
                {avatarSet && (
                  <button type="button" className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-red-100 hover:bg-red-200 text-red-500 transition-colors focus:outline-none focus:ring-2 focus:ring-red-200 shadow" onClick={dropImage} title="Прибрати зображення">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
            {/* Product Info Fields */}
            <div className="flex flex-col gap-4">
              <input
                type="text"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-400 transition text-base shadow-sm"
                value={name}
                placeholder="Назва продукту"
                onChange={(e) => setName(e.target.value)}
              />
              <select
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-400 transition text-base shadow-sm"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Оберіть категорію</option>
                {categoriesArray.map((cat: string) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <input
                type="text"
                value={description}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-400 transition text-base shadow-sm"
                placeholder="Опис продукту"
                onChange={(e) => setDescription(e.target.value)}
              />
              <input
                type="number"
                value={price}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-400 transition text-base shadow-sm"
                placeholder="Ціна, грн"
                onChange={(e) => setPrice(Number(e.target.value))}
              />
            </div>
            {/* Characteristics Section */}
            <div className="flex flex-col gap-2">
              <div className="text-lg font-semibold text-gray-700 mb-1">Характеристики</div>
              <div className="flex flex-row gap-2 mb-2">
                <input
                  className="flex-1 px-4 py-2 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-400 transition text-base shadow-sm"
                  placeholder="Ключ"
                  value={currentCharacteristic.key}
                  onChange={(e) => handleCharacteristicLabel(e.target.value)}
                />
                <input
                  className="flex-1 px-4 py-2 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-400 transition text-base shadow-sm"
                  placeholder="Значення"
                  value={currentCharacteristic.value}
                  onChange={(e) => handleCharacteristicValue(e.target.value)}
                />
                <button
                  className="px-5 py-2 rounded-xl bg-gray-900 text-white font-semibold shadow hover:bg-gray-800 transition-colors"
                  type="button"
                  onClick={handleCharacteristicPush}
                >
                  Додати
                </button>
              </div>
              <CharacteristicsMapper characteristics={characteristics} onRemove={setCharacteristics} />
            </div>
            {/* Submit Button */}
            <button
              className="w-full py-3 rounded-xl bg-gradient-to-r from-gray-900 to-gray-700 text-white font-bold text-lg shadow-lg hover:from-gray-800 hover:to-gray-900 transition-colors mt-2"
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? "Завантаження..." : "Додати продукт"}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default NewProductPage;
