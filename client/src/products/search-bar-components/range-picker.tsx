type LocalParams = {
  minState: [number, React.Dispatch<React.SetStateAction<number>>];
  maxState: [number, React.Dispatch<React.SetStateAction<number>>];
};

const RangePicker = (params: LocalParams) => {
  const { minState, maxState } = params;
  const [minStateValue, setMinState] = minState;
  const [maxStateValue, setMaxState] = maxState;

  const handleMinBlur = (e: any) => {
    const newValue = Number(e.target.value);
    if (newValue > maxStateValue) setMaxState(newValue + 100);
    if (newValue < 0) setMinState(0);
  };

  const handleMaxBlur = (e: any) => {
    const newValue = Number(e.target.value);
    if (newValue < minStateValue) setMaxState(minStateValue + 1);
  };

  return (
    <div className="flex gap-1 items-center">
      <input
        className="appearance-none w-20 px-2 py-1.5 rounded-md border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-amber-200 focus:border-amber-300 transition text-sm h-7"
        type="number"
        value={minStateValue}
        onChange={(e) => setMinState(Number(e.target.value))}
        onBlur={handleMinBlur}
        placeholder="від"
        min={0}
      />
      <input
        className="appearance-none w-20 px-2 py-1.5 rounded-md border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-amber-200 focus:border-amber-300 transition text-sm h-7"
        type="number"
        value={maxStateValue}
        onChange={(e) => setMaxState(Number(e.target.value))}
        onBlur={handleMaxBlur}
        placeholder="до"
        min={0}
      />
    </div>
  );
};

export default RangePicker;
