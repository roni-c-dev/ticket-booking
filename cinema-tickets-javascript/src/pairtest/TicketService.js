import InvalidPurchaseException from './lib/InvalidPurchaseException';
import SeatReservationService from '../thirdparty/seatbooking/SeatReservationService.js';
import TicketPaymentService from '../thirdparty/paymentgateway/TicketPaymentService.js';
import { HelperService } from './helpers/HelperService.js';

export default class TicketService {

  /**
   * Should only have private methods other than the one below.
   */
  #seatReserver = new SeatReservationService()
  #paymentService = new TicketPaymentService()
  #helperService = new HelperService();
  
  /**
   * Check for the presence of adult & return a boolean
   */
  #isAdultPresent = (ticketTypeRequests) => {
    return this.#helperService.isAdultPresent(ticketTypeRequests)
  }
  /**
   * Count the number of tickets in the request
   */
  #countTicketsInRequest = (ticketTypeRequests) => {
    return this.#helperService.countTicketsInRequest(ticketTypeRequests)
  }

  /**
   * Count the number of seats in the request
   */
   #countSeatsInRequest = (ticketTypeRequests) => {
     return this.#helperService.countSeatsInRequest(ticketTypeRequests)
   }

  /**
  * Calculate payment due for the request
  */
  #calculatePayment = (ticketTypeRequests) => {
    return this.#helperService.calculatePayment(ticketTypeRequests)
  }

  purchaseTickets(accountId, ...ticketTypeRequests) {

    if (!this.#isAdultPresent(...ticketTypeRequests)){
      return new InvalidPurchaseException('An adult must be present')
    }

    if (this.#countTicketsInRequest(...ticketTypeRequests) > 20) {
      return new InvalidPurchaseException('Seat booking limit is 20')
    }

    else {
      try {
        this.#paymentService.makePayment(accountId, this.#calculatePayment(...ticketTypeRequests))
        this.#seatReserver.reserveSeat(accountId,this.#countSeatsInRequest(...ticketTypeRequests))
        return 'Booking successful'
      } catch (err) {
        return new InvalidPurchaseException('payment or seat reservation failure')
      }
    }
    
  }
}
