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
let easterEggElement = document.querySelector('.easter-egg');

let people = [
  { index: 0, name: 'Christopher' },
  { index: 1, name: 'not Christopher' },
];

let lastTurn = {
  personIndex: people[1].index,
  date: new Date(Date.UTC(2021, 2, 15, 6)),
};

let dayOffset = 0;

// Functions declarations.

// Check whether a date is observing daylight saving time.
const isDST = (date) => {
  let jan = new Date(date.getFullYear(), 0, 1).getTimezoneOffset();
  let jul = new Date(date.getFullYear(), 6, 1).getTimezoneOffset();
  return Math.max(jan, jul) !== date.getTimezoneOffset();
};

const getTurn = (dateChecked, lastTurn) => {
  let fullDaysSinceLastTurn = Math.floor(
    Math.floor((dateChecked - lastTurn.date) / 8.64e7)
  );

  if (fullDaysSinceLastTurn % 2 === 0) return people[lastTurn.personIndex].name;
  else if (lastTurn.personIndex === 0) return people[1].name;
  else return people[0].name;
};

const setTurn = (turn) => {
  turnElement.textContent =
    dayOffset < 0
      ? `
  It was ${turn}'s turn this day.`
      : dayOffset > 0
      ? `
  It's ${turn}'s turn this day.`
      : `It's ${turn}'s turn today.`;
};

const getCountdown = (dateChecked, lastTurn) => {
  if (isDST(dateChecked)) dateChecked.setHours(dateChecked.getHours() + 1);

  let millisecondsSinceLastTurn = dateChecked - lastTurn.date;

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
  } else if (month === 11 && day === 25) {
    easterEggElement.textContent = '🦃🥧🍂';
    easterEggElement.classList.remove('visually-hidden');
    turnElement.classList.add('easter-egg-text', '🦃');
  } else {
    easterEggElement.classList.add('visually-hidden');
    turnElement.classList.remove('easter-egg-text', '🐕', '🧔', '🦃');
  }
};

const update = () => {
  date = new Date();
  date.setDate(date.getDate() + dayOffset);
  date.setMilliseconds(0);

  setTurn(getTurn(date, lastTurn));

  setDate(dateElement, date);
  setTime(timeElement, date);

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
