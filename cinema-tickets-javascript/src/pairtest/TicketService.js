// import TicketTypeRequest from './lib/TicketTypeRequest';
import InvalidPurchaseException from './lib/InvalidPurchaseException';
import SeatReservationService from '../thirdparty/seatbooking/SeatReservationService.js';
import TicketPaymentService from '../thirdparty/paymentgateway/TicketPaymentService.js';

export default class TicketService {

  /**
   * Should only have private methods other than the one below.
   */
  #seatReserver = new SeatReservationService()
  #paymentService = new TicketPaymentService()
  
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

  /**
   * Count the number of seats in the request
   */
   #countSeatsInRequest(ticketTypeRequests){
    let seatCount = 0
    for(const req of ticketTypeRequests){
      if (req.getTicketType() === 'ADULT' || req.getTicketType() === 'CHILD'){
        seatCount += req.getNoOfTickets()
      } else {
        // NO ACTION TO INCREMENT AS INFANT REQUIRES NO SEAT
      }
      
    }
    return seatCount
  }

    /**
   * Count the number of seats in the request
   */
     #calculatePayment(ticketTypeRequests){
      let paymentDue = 0
      for(const req of ticketTypeRequests){
        if (req.getTicketType() === 'ADULT'){
          paymentDue += req.getNoOfTickets() * 20
        }
        if (req.getTicketType() === 'CHILD'){
          paymentDue += req.getNoOfTickets() * 10
        }
      
      }
      return paymentDue
    }

  purchaseTickets(accountId, ...ticketTypeRequests) {
        
    if (!this.#isAdultPresent(...ticketTypeRequests)){
      return new InvalidPurchaseException('An adult must be present')
    }

    if (this.#countTicketsInRequest(...ticketTypeRequests) > 20) {
      return new InvalidPurchaseException('Seat booking limit is 20')
    }

    // TODO - else continue on to purchase using third party stuff
    else {
      // TODO - request payment
      this.#paymentService.makePayment(accountId, this.#calculatePayment(...ticketTypeRequests))
      this.#seatReserver.reserveSeat(accountId,this.#countSeatsInRequest(...ticketTypeRequests))
      return 'Booking successful'
    }
    
  }
}
