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

    test('should return succesful if an adult request present', () => {
        const result = myTicketService.purchaseTickets(goodAccountNum,[requestChild, requestInfant, requestAdult]);
        expect(result).not.toEqual(new InvalidPurchaseException('An adult must be present'));
        expect(result).toEqual('Booking successful');        
    })

    test('should return succesful for exactly twenty ticket requests', () => {
        const result = myTicketService.purchaseTickets(goodAccountNum,[requestTwenty]);
        expect(result).not.toEqual(new InvalidPurchaseException('Seat booking limit is 20'));
        expect(result).toEqual('Booking successful');
    })

    test('should return error if no adult request present', () => {
        const result = myTicketService.purchaseTickets(goodAccountNum,[requestChild]);
        expect(result).toEqual(new InvalidPurchaseException('An adult must be present'));
    })

    test('should return error if too many seats requested', () => {
        const result = myTicketService.purchaseTickets(goodAccountNum,[requestTwenty, requestInfant]);
        expect(result).toEqual(new InvalidPurchaseException('Seat booking limit is 20'));
    })

    test('should return error if account number is not an integer', () => {
        let result;
        try {
            result = myTicketService.purchaseTickets(badAccountNum,[requestAdult]);
        } catch (err) {
            result = err
            expect(result).toEqual(new TypeError('accountId must be an integer'));
        }          
    })

    test('should return error if account number is zero or less', () => {
        let result;
        try {
            result = myTicketService.purchaseTickets(0,[requestAdult]);
        } catch (err) {
            result = err
            expect(result).toEqual(new TypeError('accountId must be an integer'));
        }          
    })

    test('should return error if account number is zero or less', () => {
        let result;
        try {
            result = myTicketService.purchaseTickets(-1,[requestAdult]);
        } catch (err) {
            result = err
            expect(result).toEqual(new TypeError('accountId must be an integer'));
        }          
    })

    // TODO - integration type tests - calls to 
    // - payment request
    // - seat allocation
    // - failure in payt req or seat allocation
})