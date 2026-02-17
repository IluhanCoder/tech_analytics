import { isConstructorDeclaration } from "typescript";
import {moment} from "moment";

type LocalProps = {
  value: Date | undefined;
  dayOfWeek: boolean;
};

const DateFormater = (props: LocalProps) => {
  if (props.value) {
    const dateFormat = "uk-UA";
    const date = new Date(props.value);
    const dateOptions: any = { year: "numeric", month: "long", day: "numeric" };
    if (props.dayOfWeek) dateOptions.weekday = "long";
    const dateSting = date.toLocaleDateString(dateFormat, dateOptions);

    const hours = date.getHours(); // Get the hours (0-23)
    const minutes = date.getMinutes(); // Get the minutes (0-59)

    // Ensure that single-digit hours and minutes are formatted with leading zeros
    const formattedHours = hours < 10 ? `0${hours}` : `${hours}`;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;

    const timeString = `${formattedHours}:${formattedMinutes}`;

    return <>{dateSting} {timeString}</>;
  } else return <></>;
};

export default DateFormater;
