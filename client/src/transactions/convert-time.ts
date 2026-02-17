export default function converTime(hours: string, minutes: string, date: Date) {
  const parsedHours = parseInt(hours, 10);
  const parsedMinutes = parseInt(minutes, 10);

  if (
    isNaN(parsedHours) ||
    parsedHours < 0 ||
    parsedHours > 23 ||
    isNaN(parsedMinutes) ||
    parsedMinutes < 0 ||
    parsedMinutes > 59
  ) {
    throw new Error("Invalid hours or minutes");
  }

  // Create a new Date object with the current year, month, and day
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();

  // Set the hours and minutes
  const resultDate = new Date(year, month, day, parsedHours, parsedMinutes);

  return resultDate;
}
