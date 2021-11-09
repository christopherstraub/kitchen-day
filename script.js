// Variable initializations.
var turnElement = document.querySelector('.turn');
var dateElement = document.querySelector('.date');
var timeElement = document.querySelector('.time');
var datePrefixElement = document.querySelector('.date-prefix');
var timePrefixElement = document.querySelector('.time-prefix');
var countdownElement = document.querySelector('.countdown');
var previousDayElement = document.querySelector('.previous-day');
var nextDayElement = document.querySelector('.next-day');
var todayElement = document.querySelector('.today');

var people = [
  { index: 0, name: 'Christopher' },
  { index: 1, name: 'not Christopher' },
];

var lastTurn = {
  personIndex: people[1].index,
  date: new Date(Date.UTC(2021, 2, 15, 6)),
};

var dateOffset = 0;

// Functions declarations.

// Check whether a date is observing daylight saving time.
function isDST(date) {
  let jan = new Date(date.getFullYear(), 0, 1).getTimezoneOffset();
  let jul = new Date(date.getFullYear(), 6, 1).getTimezoneOffset();
  return Math.max(jan, jul) !== date.getTimezoneOffset();
}

function getTurn(dateChecked, lastTurn) {
  var fullDaysSinceLastTurn = Math.floor(
    Math.floor((dateChecked - lastTurn.date) / 8.64e7)
  );

  if (fullDaysSinceLastTurn % 2 === 0) return people[lastTurn.personIndex].name;
  else if (lastTurn.personIndex === 0) return people[1].name;
  else return people[0].name;
}

function setTurn(turn) {
  turnElement.textContent =
    dateOffset < 0
      ? `
  It was ${turn}'s turn this day.`
      : dateOffset > 0
      ? `
  It's ${turn}'s turn this day.`
      : `It's ${turn}'s turn today.`;
}

function getCountdown(dateChecked, lastTurn) {
  if (isDST(dateChecked)) dateChecked.setHours(dateChecked.getHours() + 1);

  var millisecondsSinceLastTurn = dateChecked - lastTurn.date;

  var millisecondsUntilNextTurn =
    Math.ceil(millisecondsSinceLastTurn / 8.64e7) * 8.64e7 -
    millisecondsSinceLastTurn;

  var fullHoursUntilNextTurn = Math.floor(millisecondsUntilNextTurn / 3.6e6);
  var fullMinutesUntilNextTurn = Math.floor(
    (millisecondsUntilNextTurn - fullHoursUntilNextTurn * 3.6e6) / 6e4
  );
  var fullSecondsUntilNextTurn = Math.floor(
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
}

function getPaddedCountdown(countdown) {
  return countdown.map((value) => (value < 10 ? '0' : '') + value);
}

function setDate(dateElement, date) {
  dateElement.textContent = new Intl.DateTimeFormat('en-US', {
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

function setTime(timeElement, date) {
  timeElement.textContent = new Intl.DateTimeFormat('en-US', {
    timeZoneName: 'short',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  }).format(date);
}

function setDatePrefix() {
  datePrefixElement.textContent = !dateOffset ? 'Today is' : 'On';
}

function setTimePrefix() {
  timePrefixElement.textContent = !dateOffset ? 'The current time is' : 'At';
}

function setCountdown(countdownElement, paddedCountdown) {
  countdownElement.textContent = `${paddedCountdown[0]}:${paddedCountdown[1]}:${paddedCountdown[2]}`;
}

function update() {
  date = new Date();
  date.setDate(date.getDate() + dateOffset);
  date.setMilliseconds(0);

  setTurn(getTurn(date, lastTurn));

  setDate(dateElement, date);
  setTime(timeElement, date);

  setDatePrefix();
  setTimePrefix();

  var paddedCountdown = getPaddedCountdown(getCountdown(date, lastTurn));

  setCountdown(countdownElement, paddedCountdown);

  if (dateOffset !== 0) todayElement.classList.remove('selected');
  else todayElement.classList.add('selected');
}

// Function calls.

update();
setInterval(update, 1000);

previousDayElement.addEventListener('click', () => {
  dateOffset--;
  update();
});

nextDayElement.addEventListener('click', () => {
  dateOffset++;
  update();
});

todayElement.addEventListener('click', () => {
  dateOffset = 0;
  update();
});
