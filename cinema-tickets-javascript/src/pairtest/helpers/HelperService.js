/**
 * External class for helper methods to allow 
 * for testability as we can create an instance 
 * of this class as a private property in TicketService
 */
export class HelperService {
    /**
    * Check that account number is valid
    */
     isValid(accountId) {
        return Boolean(Number.isInteger(accountId) && Math.sign(accountId > 0))
    }

    /**
    * Check for the presence of adult & return a boolean
    */
    isAdultPresent(ticketTypeRequests) {
        let adultPresent = false
        for(const req of ticketTypeRequests){ 
        if(req.getTicketType() === "ADULT"){
            adultPresent = true
        }
        }
        return adultPresent;
    }

    /**
    * Count the number of tickets in the request
    */
    countTicketsInRequest(ticketTypeRequests){
        let ticketCount = 0
        for(const req of ticketTypeRequests){
        ticketCount += req.getNoOfTickets()
        }
        return ticketCount
    }

    /**
    * Count the number of seats in the request
    */
    countSeatsInRequest(ticketTypeRequests){
        let seatCount = 0
        for(const req of ticketTypeRequests){
        if (req.getTicketType() === "ADULT" || req.getTicketType() === "CHILD"){
            seatCount += req.getNoOfTickets()
        } 
        }
        return seatCount
    }

    /**
    * Calculate payment due for the request
    */
    calculatePayment(ticketTypeRequests){
        let paymentDue = 0
        for(const req of ticketTypeRequests){
          if (req.getTicketType() === "ADULT"){
            paymentDue += req.getNoOfTickets() * 20
          }
          if (req.getTicketType() === "CHILD"){
            paymentDue += req.getNoOfTickets() * 10
          }
        
        }
        return paymentDue
    }
}