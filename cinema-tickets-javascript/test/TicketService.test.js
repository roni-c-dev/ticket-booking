import TicketTypeRequest from "../src/pairtest/lib/TicketTypeRequest.js";
import InvalidPurchaseException from "../src/pairtest/lib/InvalidPurchaseException.js";
import TicketService from "../src/pairtest/TicketService.js";

describe('TicketService', () => {
    const requestAdult = new TicketTypeRequest('ADULT', 1);
    const requestChild = new TicketTypeRequest('CHILD', 3);
    const requestInfant =  new TicketTypeRequest('INFANT',1);
    const requestTwenty = new TicketTypeRequest('ADULT', 20);
    // const requestBadTicketType = new TicketTypeRequest('FAKE',1);
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


    test('should return error if too many seats requested', () => {
        const result = myTicketService.purchaseTickets(goodAccountNum,[requestTwenty, requestChild]);
        expect(result).toEqual(new InvalidPurchaseException('Seat booking limit is 20'))
    })

    test('should return error if account number is a string', () => {
        let result;
        try {
            result = myTicketService.purchaseTickets(badAccountNum,[requestAdult]);
        } catch (err) {
            result = err
            expect(result).toEqual(new TypeError('accountId must be an integer'))
        }
        
        
    })

    // TODO - can I fake this as it won't actually create the obj?
    xtest('should return error if incorrect ticket type requested', () => {
        let result;
        try {
            result = myTicketService.purchaseTickets(101, [requestBadTicketType]);
        } catch (err) {
            result = err;
            expect(result).toEqual(new TypeError('type must be ADULT, CHILD, or INFANT'))
        }
    })

})