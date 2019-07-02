console.log('Client Side javascript file is loaded');

const weatherForm = document.querySelector('form');
const searchElement = document.querySelector('input');
const messageOne = document.querySelector('#message-1');
const messageTwo = document.querySelector('#message-2');
weatherForm.addEventListener('submit', e => {
  e.preventDefault();
  messageOne.textContent = 'Loading...';
  const location = searchElement.value;
  fetch('http://localhost:3000/weather?address=' + location).then(resp => {
    resp.json().then(data => {
      if (data.errors) {
        messageOne.textContent = data.errors;
        messageTwo.textContent = '';
      } else {
        messageOne.textContent = data.location;
        messageTwo.textContent = JSON.stringify(data.forecast);
        console.log(data.forecast);
        console.log(data.location);
      }
    });
  });
});
