

const spanElement = document.querySelector('span');
const buttonElement = document.querySelector('button');

buttonElement.addEventListener('click', async function() {
  const resp = await fetch('http://localhost:3000/api/ticket', { method: 'POST'});

  if ( !resp.ok ) return drawContentSpan(`Error on creating ticket`);

  const ticket = await resp.json();

  drawContentSpan(`Ticket #${ticket.number} creado satisfactoriamente`);

});


function drawContentSpan(message) {
  spanElement.innerText = message;
}

async function getLastTicketNumber() {
  const resp = await fetch('http://localhost:3000/api/ticket/last');

  if ( !resp.ok ) return drawContentSpan(`Error on getting last ticket number`);

  const lastNumberTicket = await resp.json();

  drawContentSpan(`Ultimo ticket creado: #${ lastNumberTicket }`);
}

function init(){
  
  getLastTicketNumber();

}

init();
