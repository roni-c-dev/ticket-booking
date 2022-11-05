import InvalidPurchaseException from "./lib/InvalidPurchaseException";
import SeatReservationService from "../thirdparty/seatbooking/SeatReservationService.js";
import TicketPaymentService from "../thirdparty/paymentgateway/TicketPaymentService.js";
import { HelperService } from "./helpers/HelperService.js";

import logger from "../pairtest/helpers/LoggerService.js";

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

    if (!Number.isInteger(accountId)){
      logger.log({
        message: "Ticket request accountId threw an Exception",
        level: "error"
      })
      throw new InvalidPurchaseException("accountId must be an integer")
    }

    if (!this.#isAdultPresent(...ticketTypeRequests)){
      logger.log({
        message: "Ticket request did not contain adult and threw an Exception",
        level: "error"
      })
      throw new InvalidPurchaseException("An adult must be present")
    }

    if (this.#countTicketsInRequest(...ticketTypeRequests) > 20) {
      logger.log({
        message: "Ticket request for more than 20 tickets",
        level: "error"
      })
      throw new InvalidPurchaseException("Ticket booking limit is 20")
    }

    else {
      try {
        this.#paymentService.makePayment(accountId, this.#calculatePayment(...ticketTypeRequests))  
      } catch (err) {
        logger.log({
          message: "An unknown error occurred in the payment service, please contact support",
          level: "error"
        })
        throw new InvalidPurchaseException("payment failure: " + err)
      }

      try {
        this.#seatReserver.reserveSeat(accountId,this.#countSeatsInRequest(...ticketTypeRequests))
        return "Booking successful"
      } catch (err) {
        logger.log({
          message: "An unknown error occurred in the seat booking service, please contact support",
          level: "error"
        })
        throw new InvalidPurchaseException("seat booking failure: " + err)
      }
    }
    
  }
}
