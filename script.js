// Functions declarations.
function getDaysSinceEpoch(date) {
  return date / 8.64e7;
}

function setCurrentTurn(people, fullDaysSinceLastTurn) {
  if (fullDaysSinceLastTurn % 2 === 0)
    document.getElementsByClassName('turn')[0].textContent = people[0].name;
  else document.getElementsByClassName('turn')[0].textContent = people[1].name;
}

function getTimeUntilNextTurn(daysSinceLastTurn, fullDaysSinceLastTurn) {
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

// Variable initializations.
var date = new Date();

var people = [
  { index: 0, name: 'Christopher' },
  { index: 1, name: 'not Christopher' },
];

const constraint = {
  personIndex: people[0].index,
  lastTurnDate: new Date(Date.UTC(2021, 0, 10, 6, 0, 0)),
};

var daysSinceLastTurn =
  getDaysSinceEpoch(date) - getDaysSinceEpoch(constraint.lastTurnDate);

var fullDaysSinceLastTurn = Math.floor(
  getDaysSinceEpoch(date) - getDaysSinceEpoch(constraint.lastTurnDate)
);

var timeUntilNextTurn = getTimeUntilNextTurn(
  daysSinceLastTurn,
  fullDaysSinceLastTurn
);

// Function calls.
setCurrentTurn(people, fullDaysSinceLastTurn);

// DOM manipulations.
document.getElementsByClassName(
  'date'
)[0].textContent = new Intl.DateTimeFormat('en-US', {
  timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
}).format(date);

document.getElementsByClassName(
  'time'
)[0].textContent = new Intl.DateTimeFormat('en-US', {
  timeZoneName: 'short',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
}).format(date);

document.getElementsByClassName(
  'time-until-next-turn'
)[0].textContent = `It will be the next person's turn in
${Math.floor(timeUntilNextTurn[0])} hours, ${Math.floor(
  timeUntilNextTurn[1]
)} minutes, and ${Math.floor(timeUntilNextTurn[2])} seconds,
`;
