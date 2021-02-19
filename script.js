// Variable initializations.
var dateElement = document.querySelector('.date');
var timeElement = document.querySelector('.time');
var countdownElement = document.querySelector('.countdown');

var people = [
  { index: 0, name: 'Christopher' },
  { index: 1, name: 'not Christopher' },
];

const constraint = {
  personIndex: people[0].index,
  lastTurnDate: new Date(Date.UTC(2021, 0, 10, 6, 0, 0)),
};

// Functions declarations.
function getDaysSinceEpoch(date) {
  return date / 8.64e7;
}

function setCurrentTurn(people, date) {
  var fullDaysSinceLastTurn = Math.floor(
    getDaysSinceEpoch(date) - getDaysSinceEpoch(constraint.lastTurnDate)
  );

  if (fullDaysSinceLastTurn % 2 === 0)
    document.getElementsByClassName('turn')[0].textContent = people[0].name;
  else document.getElementsByClassName('turn')[0].textContent = people[1].name;
}

function getTimeUntilNextTurn(date) {
  var daysSinceLastTurn =
    getDaysSinceEpoch(date) - getDaysSinceEpoch(constraint.lastTurnDate);

  var fullDaysSinceLastTurn = Math.floor(
    getDaysSinceEpoch(date) - getDaysSinceEpoch(constraint.lastTurnDate)
  );

  var daysUntilNextTurn = 1 - (daysSinceLastTurn - fullDaysSinceLastTurn);

  var hoursUntilNextTurn = daysUntilNextTurn * 24;
  var minutesUntilNextTurn = daysUntilNextTurn * 1440;
  var secondsUntilNextTurn = daysUntilNextTurn * 86400;

  return [
    hoursUntilNextTurn,
    minutesUntilNextTurn - Math.floor(hoursUntilNextTurn) * 60,
    secondsUntilNextTurn -
      Math.floor(hoursUntilNextTurn) * 3600 -
      Math.floor(minutesUntilNextTurn - Math.floor(hoursUntilNextTurn) * 60) *
        60 +
      1,
  ];
}

function getPaddedTimeUntilNextTurn(timeUntilNextTurn) {
  var flooredTimeUntilNextTurn = timeUntilNextTurn.map(Math.floor);
  return flooredTimeUntilNextTurn.map(
    (value) => (value < 10 ? '0' : '') + value
  );
}

function setDate(dateElement) {
  dateElement.textContent = new Intl.DateTimeFormat('en-US', {
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

function setTime(timeElement) {
  timeElement.textContent = new Intl.DateTimeFormat('en-US', {
    timeZoneName: 'short',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  }).format(date);
}

function setCountdown(countdownElement, paddedTimeUntilNextTurn) {
  countdownElement.textContent = `${paddedTimeUntilNextTurn[0]}:${paddedTimeUntilNextTurn[1]}:${paddedTimeUntilNextTurn[2]}`;
}

function update() {
  date = new Date();

  setCurrentTurn(people, date);

  var timeUntilNextTurn = getTimeUntilNextTurn(date);
  var paddedTimeUntilNextTurn = getPaddedTimeUntilNextTurn(timeUntilNextTurn);

  setDate(dateElement);
  setTime(timeElement);
  setCountdown(countdownElement, paddedTimeUntilNextTurn);
}

// Function calls.
update();
setInterval(update, 1000);
