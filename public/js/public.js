
function renderTickets(tickets) {
  if ( tickets.length === 0 ) return;

  console.log(tickets.length);

  tickets.forEach((ticket, index) => {
    
    const lblNumberTicket = document.querySelector(`#lbl-ticket-0${index + 1}`);
    const lblTicketDesk = document.querySelector(`#lbl-desk-0${index + 1}`);

    lblNumberTicket.innerHTML = ticket.number;
    lblTicketDesk.innerHTML = ticket.handleAtDesk;
  });

}

async function loadWorkingTickets() {

  const tickets = await fetch('/api/ticket/working-on').then(resp=>resp.json());
  
  renderTickets(tickets);
}


function connectToWebSockets() {

  const socket = new WebSocket( 'ws://localhost:3000/ws' );

  // En espera de mensaje de wss
  socket.onmessage = ( event ) => {
    const {type, payload} = JSON.parse(event.data);// event.data es un string

    if ( type === 'on-working-changed' ) {
      renderTickets(payload); 
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


// init
connectToWebSockets();
loadWorkingTickets();
