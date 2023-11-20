// Variable initializations.
let turnElement = document.querySelector('.turn');
let dateElement = document.querySelector('.date');
let timeElement = document.querySelector('.time');
let datePrefixElement = document.querySelector('.date-prefix');
let timePrefixElement = document.querySelector('.time-prefix');
let countdownElement = document.querySelector('.countdown');
let previousDayElement = document.querySelector('.previous-day');
let nextDayElement = document.querySelector('.next-day');
let todayElement = document.querySelector('.today');
let dateInputElement = document.querySelector('.date-input');
let easterEggElement = document.querySelector('.easter-egg');

let people = ['Christopher', 'not Christopher'];

let lastTurn = {
  personIndex: 1,
  date: new Date(2021, 2, 15),
};

let dayOffset = 0;

// Functions declarations.
// Check whether a date is in Daylight Saving Time.
const isDST = (date) => {
  /**
   * Date.prototype.getTimezoneOffset() returns the difference, in minutes,
   * between the date as evaluated in the UTC time zone and as evaluated in the
   * local time zone. Thus, if the local time zone does not observe DST,
   * getTimezoneOffset() always returns the same value. However, if the local
   * time zone does observe DST, the value returned by getTimezoneOffset() if
   * the date is in DST (clocks set forward 1 hour) will be 60 less than the
   * value returned if the date is not in DST.
   */
  let janTimezoneOffset = new Date(
    date.getFullYear(),
    0,
    1
  ).getTimezoneOffset();
  let julTimezoneOffset = new Date(
    date.getFullYear(),
    6,
    1
  ).getTimezoneOffset();

  /**
   * Whether or not the local time zone observes DST,
   * Math.max(janTimezoneOffset, julTimezoneOffset) will return the time zone
   * offset when the time zone is in standard time. If the date time offset is
   * less than standard time offset, the date is in DST. (The only exception to
   * this is the Antarctica/Casey time zone, where DST is behind standard time
   * [DST offset is greater than standard time offset].)
   */
  return (
    date.getTimezoneOffset() < Math.max(janTimezoneOffset, julTimezoneOffset)
  );
};

// Adjust last turn date according to time zone status (standard time or DST).
function getCorrectedLastTurnDate(lastTurnDate, date) {
  const lastTurnDateCopy = new Date(lastTurnDate);

  if (isDST(date) && !isDST(lastTurnDate))
    lastTurnDateCopy.setHours(lastTurnDate.getHours() - 1);
  else if (!isDST(date) && isDST(lastTurnDate))
    lastTurnDateCopy.setHours(lastTurnDate.getHours() + 1);

  return lastTurnDateCopy;
}

const getTurn = (date, lastTurn) => {
  const lastTurnDate = getCorrectedLastTurnDate(lastTurn.date, date);

  const fullDaysSinceLastTurn = Math.floor((date - lastTurnDate) / 8.64e7);

  // Turn same as last turn if full days since last turn is even.
  if (fullDaysSinceLastTurn % 2 === 0) return people[lastTurn.personIndex];
  else return people[lastTurn.personIndex === 0 ? 1 : 0];
};

const setTurn = (turn, date) => {
  if (turn.startsWith('not ') && date >= new Date(2022, 7, 6)) {
    const name = turn.slice(4);
    turnElement.innerHTML =
      dayOffset < 0
        ? `It was <s>not</s> ${name}'s turn this day.`
        : dayOffset > 0
        ? `It's <s>not</s> ${name}'s turn this day.`
        : `It's <s>not</s> ${name}'s turn today.`;
  } else
    turnElement.textContent =
      dayOffset < 0
        ? `It was ${turn}'s turn this day.`
        : dayOffset > 0
        ? `It's ${turn}'s turn this day.`
        : `It's ${turn}'s turn today.`;
};

const getCountdown = (date, lastTurn) => {
  const lastTurnDate = getCorrectedLastTurnDate(lastTurn.date, date);

  let millisecondsSinceLastTurn = date - lastTurnDate;

  let millisecondsUntilNextTurn =
    Math.ceil(millisecondsSinceLastTurn / 8.64e7) * 8.64e7 -
    millisecondsSinceLastTurn;

  let fullHoursUntilNextTurn = Math.floor(millisecondsUntilNextTurn / 3.6e6);
  let fullMinutesUntilNextTurn = Math.floor(
    (millisecondsUntilNextTurn - fullHoursUntilNextTurn * 3.6e6) / 6e4
  );
  let fullSecondsUntilNextTurn = Math.floor(
    (millisecondsUntilNextTurn -
      fullHoursUntilNextTurn * 3.6e6 -
      fullMinutesUntilNextTurn * 6e4) /
      1000
  );

  return [
    fullHoursUntilNextTurn,
    fullMinutesUntilNextTurn,
    fullSecondsUntilNextTurn,
  ];
};

const getPaddedCountdown = (countdown) =>
  countdown.map((value) => (value < 10 ? '0' : '') + value);

const setDate = (dateElement, date) => {
  dateElement.textContent = new Intl.DateTimeFormat('en-US', {
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};

const setTime = (timeElement, date) => {
  timeElement.textContent = new Intl.DateTimeFormat('en-US', {
    timeZoneName: 'short',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  }).format(date);
};

const setDateInput = (dateInputElement, date) => {
  const dateCopy = new Date(date);

  dateCopy.setMinutes(date.getMinutes() - date.getTimezoneOffset());

  dateInputElement.value = dateCopy.toISOString().substring(0, 10);
};

const setDatePrefix = () => {
  datePrefixElement.textContent = !dayOffset ? 'Today is' : 'On';
};

const setTimePrefix = () => {
  timePrefixElement.textContent = !dayOffset ? 'The current time is' : 'At';
};

const setCountdown = (countdownElement, paddedCountdown) => {
  countdownElement.textContent = `${paddedCountdown[0]}:${paddedCountdown[1]}:${paddedCountdown[2]}`;
};

const setEasterEgg = (month, day, year) => {
  if (month === 12 && day === 7) {
    easterEggElement.textContent = '🐕🎉🎂🎁';
    easterEggElement.classList.remove('visually-hidden');
    turnElement.classList.add('easter-egg-text', '🐕');
  } else if (month === 12 && day === 25) {
    easterEggElement.textContent = '🧔🎉🎂🎁';
    easterEggElement.classList.remove('visually-hidden');
    turnElement.classList.add('easter-egg-text', '🧔');
  } else if (month === 11 && day === 23) {
    easterEggElement.textContent = '🦃🥧🍂';
    easterEggElement.classList.remove('visually-hidden');
    turnElement.classList.add('easter-egg-text', '🦃');
  } else {
    easterEggElement.classList.add('visually-hidden');
    turnElement.classList.remove('easter-egg-text', '🐕', '🧔', '🦃');
  }
};

const update = () => {
  const date = new Date();
  date.setDate(date.getDate() + dayOffset);
  date.setMilliseconds(0);

  setTurn(getTurn(date, lastTurn), date);

  setDate(dateElement, date);
  setTime(timeElement, date);
  if (document.activeElement !== dateInputElement)
    setDateInput(dateInputElement, date);

  setDatePrefix();
  setTimePrefix();

  setEasterEgg(date.getMonth() + 1, date.getDate(), date.getFullYear());

  let paddedCountdown = getPaddedCountdown(getCountdown(date, lastTurn));

  setCountdown(countdownElement, paddedCountdown);

  if (dayOffset !== 0) todayElement.classList.remove('selected');
  else todayElement.classList.add('selected');
};

// Function calls.
update();
setInterval(update, 1000);

previousDayElement.addEventListener('click', () => {
  dayOffset--;
  update();
});

nextDayElement.addEventListener('click', () => {
  dayOffset++;
  update();
});

todayElement.addEventListener('click', () => {
  dayOffset = 0;
  update();
});

dateInputElement.addEventListener('change', (event) => {
  if (!event.target.validity.badInput) {
    const [year, month, day] = event.target.value.split('-');
    const date = new Date(year, month - 1, day);

    dayOffset = Math.ceil((date - new Date()) / 8.64e7);
    update();
  }
});
