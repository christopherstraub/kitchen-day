// Variable initializations.
var turnElement = document.querySelector('.turn');
var dateElement = document.querySelector('.date');
var timeElement = document.querySelector('.time');
var countdownElement = document.querySelector('.countdown');
var switchTurnsButton = document.querySelector('.switch-turns');

var people = [
  { index: 0, name: 'Christopher' },
  { index: 1, name: 'not Christopher' },
];

var lastTurn = {
  personIndex: people[1].index,
  date: new Date(Date.UTC(2021, 2, 15, 5, 0, 0)),
};

// Functions declarations.

// getTurn tak
function getTurn(dateChecked, lastTurn) {
  var fullDaysSinceLastTurn = Math.floor(
    Math.floor((dateChecked - lastTurn.date) / 8.64e7)
  );

  if (fullDaysSinceLastTurn % 2 === 0) return people[lastTurn.personIndex].name;
  else if (lastTurn.personIndex === 0) return people[1].name;
  else return people[0].name;
}

function setTurn(turn) {
  turnElement.textContent = turn;
}

function getCountdown(dateChecked, lastTurn) {
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

function setCountdown(countdownElement, paddedCountdown) {
  countdownElement.textContent = `${paddedCountdown[0]}:${paddedCountdown[1]}:${paddedCountdown[2]}`;
}

function update() {
  date = new Date().setMilliseconds(0);

  setDate(dateElement, date);
  setTime(timeElement, date);

  setTurn(getTurn(date, lastTurn));

  var paddedCountdown = getPaddedCountdown(getCountdown(date, lastTurn));

  setCountdown(countdownElement, paddedCountdown);
}

// Function calls.

update();
setInterval(update, 1000);

switchTurnsButton.addEventListener('click', () => {
  turnElement.textContent =
    turnElement.textContent === people[0].name
      ? people[1].name
      : people[0].name;

  lastTurn.personIndex = lastTurn.personIndex === 0 ? 1 : 0;
});
