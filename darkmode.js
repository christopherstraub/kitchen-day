var bodyElement = document.querySelector('body');
var navItemElements = document.querySelectorAll('.nav-masthead > span');

navItemElements.forEach((element) => {
  element.addEventListener('click', () => {
    if (!element.classList.contains('active')) {
      document
        .querySelector('.nav-masthead > .active')
        .classList.toggle('active');
      element.classList.toggle('active');
      bodyElement.classList.toggle('dark');
    }
  });
});
