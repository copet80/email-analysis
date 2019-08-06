const MINUTE = 60;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;
const MONTH = 4 * WEEK;
const YEAR = 12 * MONTH;

export function durationFormat(value) {
  if (value === null || value >= Number.MAX_SAFE_INTEGER) {
    return 'n/a';
  }

  if (value < MINUTE) {
    return `${value} secs`;
  } else if (value < HOUR) {
    return `${Math.floor(value / MINUTE)} mins`;
  } else if (value < DAY) {
    return `${Math.floor(value / HOUR)} hrs`;
  } else if (value < WEEK) {
    return `${Math.floor(value / DAY)} days`;
  } else if (value < MONTH) {
    return `${Math.floor(value / WEEK)} wks`;
  } else if (value < YEAR) {
    return `${Math.floor(value / MONTH)} mths`;
  } else {
    return `${Math.floor(value / YEAR)} yrs`;
  }
}
