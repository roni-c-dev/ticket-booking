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
  #isAccountIDValid = (accountId) => {
    const isValid = this.#helperService.isAccountIDValid(accountId);

    if(isValid) {
      return true
    } else {
      logger.log({
        message: "Ticket request accountId threw an Exception",
        level: "error"
      })
      throw new InvalidPurchaseException("Invalid account ID provided")
    }
  }

  /**
   * Check for the presence of adult & return a boolean
   */
  #isAdultPresent = (ticketTypeRequests) => {
    if(this.#helperService.isAdultPresent(ticketTypeRequests)) {
      return true
    } else {
      logger.log({
        message: "Ticket request did not contain adult and threw an Exception",
        level: "error"
      })
      throw new InvalidPurchaseException("An adult must be present")
    }
  }
  /**
   * Count the number of tickets in the request
   */
  #countTicketsInRequest = (ticketTypeRequests) => {
    const ticketCount = this.#helperService.countTicketsInRequest(ticketTypeRequests);
    if( ticketCount > 20){
      logger.log({
        message: "Ticket request for more than 20 tickets",
        level: "error"
      })
      throw new InvalidPurchaseException("Ticket booking limit is 20")
    } else {
      return ticketCount
    }
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

  /**
  * Overall calculation to determine that a request is valid
  */
   #isRequestValid = (accountId, ticketTypeRequests) => {
     // valid account id, adult present, less than 20 tickets in request
    return this.#isAccountIDValid(accountId) && 
            this.#isAdultPresent(ticketTypeRequests) &&
            this.#countTicketsInRequest(ticketTypeRequests) <= 20
  }

  /**
   * Make a payment
   * FOR DISCUSSION - WOULD THESE SIT BETTER IN HELPER SERVICE OR HERE? IS THERE A PATTERN?
   */
  #makePayment = (accountId, totalAmountToPay) => {
    try {
      this.#paymentService.makePayment(accountId, totalAmountToPay)  
      logger.log({
        message: "Successful payment",
        level: "info"
      })
    } catch (err) {
      logger.log({
        message: "An unknown error occurred in the payment service, please contact support",
        level: "error"
      })
      throw new InvalidPurchaseException("payment failure: " + err)
    }
  }

  /**
   * Reserve seats
   * FOR DISCUSSION - WOULD THESE SIT BETTER IN HELPER SERVICE OR HERE? IS THERE A PATTERN?
   */
  #reserveSeats = (accountId, totalSeatsToReserve) => {
    try {
      this.#seatReserver.reserveSeat(accountId, totalSeatsToReserve)
      logger.log({
        message: "Successful booking",
        level: "info"
      })
    } catch (err) {
      logger.log({
        message: "An unknown error occurred in the seat booking service, please contact support",
        level: "error"
      })
      throw new InvalidPurchaseException("seat booking failure: " + err)
    }
  }

  purchaseTickets(accountId, ...ticketTypeRequests) {   

    // FOR DISCUSSION - COVERING THE ELSE BRANCH?
    // WITH EXISTING ERRORS COVERED IN EACH FUNCTION THERE DOESN'T SEEM A WAY TO REACH IT
    if (this.#isRequestValid(accountId, ...ticketTypeRequests)){
      const totalAmountToPay = this.#calculatePayment(...ticketTypeRequests);
      const totalSeatsToReserve = this.#countSeatsInRequest(...ticketTypeRequests);

      this.#makePayment(accountId, totalAmountToPay);
      this.#reserveSeats(accountId, totalSeatsToReserve);
      
      logger.log({
        message: "Payment and reservation completed successfully",
        level: "info"
      })
      return "Booking successful"    
    } 
    
  }
}
