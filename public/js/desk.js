
// Referencias HTML
const lblPending = document.querySelector('#lbl-pending');
const h1Desk = document.querySelector('h1'); 
const infNoPendingTickets = document.querySelector('.alert');
const lblCurrentTicket = document.querySelector('small');

const btnDraw = document.querySelector('#btn-draw');
const btnDone = document.querySelector('#btn-done');

let desk;
let workingTicket = null;// ticket que se estará trabajando en el desk

async function loadInitialCount() {

  const pending = await fetch('/api/ticket/pending').then(resp => resp.json());
  const pendingTicketsNumber = pending.length || 0;// total de tickets que estarán pendientes

  checkCurrentTicketCount(pendingTicketsNumber);


}

function loadQueryParameters() {
  const url = new URL(window.location.href);

  const params = new URLSearchParams(url.search);

  if ( !params.has('escritorio') ) {
    window.location = 'index.html';
    throw new Error('Escritorio es requerido');
  }

  desk = params.get('escritorio');

  h1Desk.innerHTML = `${desk}`;
}

function checkCurrentTicketCount( currentTicketCount = 0) {
  if (currentTicketCount === 0) {
    infNoPendingTickets.classList.remove('d-none');// d-none es una clase de bootstrap que esconde el div
    lblPending.style.visibility = 'hidden';
  } else {
    infNoPendingTickets.classList.add('d-none');
    lblPending.style.visibility = 'visible';
    lblPending.innerHTML = `${ currentTicketCount }`;
  }

}

async function getTicket() {
  
  await finishTicket();

  const {status, ticket, message} = await fetch(`/api/ticket/draw/${desk}`).then(resp=>resp.json());// mandar el desk actual al ticket que será atendido

  if ( status === 'error' ) {
    lblCurrentTicket.innerText = message;
    return;
  }

  workingTicket = ticket;
  lblCurrentTicket.innerText = workingTicket.number;

  // lblPending.innerHTML = `${+lblPending.innerHTML - 1}`;// DEcrementar la cola
}

async function finishTicket() {
  
  if (!workingTicket) {
    lblCurrentTicket.innerHTML = 'No hay ticket para terminar';
    return;
  }

  const { status, message } = await fetch(`/api/ticket/done/${workingTicket.id}`, { method: 'put' }).then(resp=>resp.json());

  if ( status === 'error' ) {
    lblCurrentTicket.innerHTML = message;
    return;
  }
  
  lblCurrentTicket.innerHTML = `Ticket ${workingTicket.number} terminado`;
  workingTicket = null;

}


function connectToWebSockets() {

  const socket = new WebSocket( 'ws://localhost:3000/ws' );

  socket.onmessage = ( event ) => {
    //console.log(event.data);// on-ticket-count-changed
    const { data } = event;
    const messageReceivedFromWss = JSON.parse(data);

    if ( messageReceivedFromWss.type === 'on-ticket-count-changed' ) {
      //lblPending.innerHTML = `${messageReceivedFromWss.payload}`;
      const pendingTicketsNumber = messageReceivedFromWss.payload || 0;

      checkCurrentTicketCount(pendingTicketsNumber);
    }
  };

  socket.onclose = ( event ) => {
    console.log( 'Connection closed' );
    setTimeout( () => {
      console.log( 'retrying to connect' );
      connectToWebSockets();
    }, 1500 );

  };

  socket.onopen = ( event ) => {
    console.log( 'Connected' );
  };

}

// Listeners
btnDraw.addEventListener('click', getTicket);
btnDone.addEventListener('click', finishTicket);

// Init 
loadInitialCount();
loadQueryParameters();
connectToWebSockets();
