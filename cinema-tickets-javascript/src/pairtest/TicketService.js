import TicketTypeRequest from './lib/TicketTypeRequest';
import InvalidPurchaseException from './lib/InvalidPurchaseException';
import SeatReservationService from '../thirdparty/seatbooking/SeatReservationService.js';

export default class TicketService {

  /**
   * Should only have private methods other than the one below.
   */
  #seatReserver = new SeatReservationService()
  
  /**
   * Check for the presence of adult & return a boolean
   */
  #isAdultPresent(ticketTypeRequests) {
    let adultPresent = false
    for(const req of ticketTypeRequests){ 
      if(req.getTicketType() === 'ADULT'){
        adultPresent = true
      }
    }
    return adultPresent;
  }
  /**
   * Count the number of tickets in the request
   */
  #countTicketsInRequest(ticketTypeRequests){
    let ticketCount = 0
    for(const req of ticketTypeRequests){
      ticketCount += req.getNoOfTickets()
    }
    return ticketCount
  }

  // TODO - countSeatsInRequest
  // TODO - requestPayment
  // TODO - allocateSeats
  purchaseTickets(accountId, ...ticketTypeRequests) {
        
    if (!this.#isAdultPresent(...ticketTypeRequests)){
      return new InvalidPurchaseException('An adult must be present')
    }

    if (this.#countTicketsInRequest(...ticketTypeRequests) > 20) {
      return new InvalidPurchaseException('Seat booking limit is 20')
    }

    // TODO - else continue on to purchase using third party stuff
    else {
      this.#seatReserver.reserveSeat(accountId,1)
      return 'Booking successful'
    }
    
  }
}
