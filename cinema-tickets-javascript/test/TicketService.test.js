import TicketTypeRequest from "../src/pairtest/lib/TicketTypeRequest.js";
import InvalidPurchaseException from "../src/pairtest/lib/InvalidPurchaseException.js";
import TicketService from "../src/pairtest/TicketService.js";

describe('TicketService', () => {
    const requestAdult = new TicketTypeRequest('ADULT', 1);
    const requestChild = new TicketTypeRequest('CHILD', 3);
    const requestInfant =  new TicketTypeRequest('INFANT',1);
    const requestTwenty = new TicketTypeRequest('ADULT', 20);
    const goodAccountNum = 1200;
    const badAccountNum = '666';

    const myTicketService =  new TicketService();
    test('should not throw error if an adult request present', () => {
        const result = myTicketService.purchaseTickets(goodAccountNum,[requestChild, requestAdult]);
        expect(result).not.toEqual(new InvalidPurchaseException('An adult must be present'));
        expect(result).toEqual('Booking successful')
    })

    test('should throw error if no adult request present', () => {
        const result = myTicketService.purchaseTickets(goodAccountNum,[requestChild]);
        expect(result).toEqual(new InvalidPurchaseException('An adult must be present'))
    })


    test('should throw error if too many seats requested', () => {
        const result = myTicketService.purchaseTickets(goodAccountNum,[requestTwenty, requestChild]);
        expect(result).toEqual(new InvalidPurchaseException('Seat booking limit is 20'))
    })

})