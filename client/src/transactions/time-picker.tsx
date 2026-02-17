import React, { useState } from "react";
import { inputStyle } from "../styles/form-styles";

interface LocalParams {
  onChange?: (hours: string, minutes: string) => void;
  defaultHour: string;
}

const TimePicker = (params: LocalParams) => {
  const { onChange, defaultHour } = params;

  const [selectedHour, setSelectedHour] = useState<string>(defaultHour);
  const [selectedMinute, setSelectedMinute] = useState<string>("00");

  const hours = Array.from({ length: 24 }, (_, i) =>
    i < 10 ? `0${i}` : `${i}`,
  );
  const minutes = Array.from({ length: 60 }, (_, i) =>
    i < 10 ? `0${i}` : `${i}`,
  );

  const handleHourChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedHour(e.target.value);
    if (onChange) onChange(e.target.value, selectedMinute);
  };

  const handleMinuteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMinute(e.target.value);
    if (onChange) onChange(selectedHour, e.target.value);
  };

  return (
    <div className="time-picker">
      <select
        className={inputStyle}
        value={selectedHour}
        onChange={handleHourChange}
      >
        {hours.map((hour) => (
          <option key={hour} value={hour}>
            {hour}
          </option>
        ))}
      </select>
      :
      <select
        className={inputStyle}
        value={selectedMinute}
        onChange={handleMinuteChange}
      >
        {minutes.map((minute) => (
          <option key={minute} value={minute}>
            {minute}
          </option>
        ))}
      </select>
    </div>
  );
};

export default TimePicker;
