import { format, parse } from "date-fns";
import { formatInTimeZone } from 'date-fns-tz';

let currentTimeInterval;

function updateTime(locationTimezone, container) {
  if (currentTimeInterval) {
    clearInterval(currentTimeInterval);
  }

  const updateClock = () => {
    const utcDate = new Date();
    const formattedDateAndTime = formatInTimeZone(utcDate, locationTimezone, "PPpp");
    container.innerText = formattedDateAndTime;
  };

  updateClock();
  currentTimeInterval = setInterval(() => updateClock(), 1000);
}

function formatDate(dateString, container) {
  const date = parse(dateString, "yyyy-MM-dd", new Date());
  const formattedDate = format(date, "PP");
  container.innerText = formattedDate;
}

export { updateTime, formatDate };