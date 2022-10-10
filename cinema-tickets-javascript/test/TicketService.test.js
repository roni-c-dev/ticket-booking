import TicketTypeRequest from "../src/pairtest/lib/TicketTypeRequest.js";
import InvalidPurchaseException from "../src/pairtest/lib/InvalidPurchaseException.js";
import TicketService from "../src/pairtest/TicketService.js";
import SeatReservationService from "../src/thirdparty/seatbooking/SeatReservationService.js";
import TicketPaymentService from "../src/thirdparty/paymentgateway/TicketPaymentService.js";
import { jest}  from '@jest/globals'

describe('TicketService', () => {
    const requestAdult = new TicketTypeRequest('ADULT', 1);
    const requestChild = new TicketTypeRequest('CHILD', 3);
    const requestInfant =  new TicketTypeRequest('INFANT',1);
    const requestTwenty = new TicketTypeRequest('ADULT', 20);
    const goodAccountNum = 1200;
    const badAccountNum = '666';
    let myMockSRS, myMockTPS;

    const myTicketService =  new TicketService();

    beforeEach(() => {
        // reset any previous mock and mock the appropriate services anew
        jest.resetAllMocks();
        myMockTPS = jest.spyOn(TicketPaymentService.prototype, 'makePayment');
        myMockSRS = jest.spyOn(SeatReservationService.prototype, 'reserveSeat');
    })
    test('should take payment, book seat and return succesful if an adult request present', () => {
        const result = myTicketService.purchaseTickets(goodAccountNum,[requestChild, requestInfant, requestAdult]);  
        expect(myMockTPS).toHaveBeenCalled();
        expect(myMockSRS).toHaveBeenCalled();
        expect(result).toEqual('Booking successful');        
    })

    test('should take payment, book seat and return succesful for exactly twenty ticket requests', () => {
        const result = myTicketService.purchaseTickets(goodAccountNum,[requestTwenty]);
        expect(myMockTPS).toHaveBeenCalled();
        expect(myMockSRS).toHaveBeenCalled();
        expect(result).toEqual('Booking successful');
    })

    test('should return error if no adult request present', () => {
        const result = myTicketService.purchaseTickets(goodAccountNum,[requestChild]);
        expect(result).toEqual(new InvalidPurchaseException('An adult must be present'));
        expect(myMockTPS).not.toHaveBeenCalled();
        expect(myMockSRS).not.toHaveBeenCalled();
    })

    test('should return error if too many seats requested', () => {
        const result = myTicketService.purchaseTickets(goodAccountNum,[requestTwenty, requestInfant]);
        expect(result).toEqual(new InvalidPurchaseException('Ticket booking limit is 20'));
        expect(myMockTPS).not.toHaveBeenCalled();
        expect(myMockSRS).not.toHaveBeenCalled();
    })

    test('should return error if account number is not an integer', () => {
        let result;
        try {
            result = myTicketService.purchaseTickets(badAccountNum,[requestAdult]);
        } catch (err) {
            result = err
            expect(result).toEqual(new TypeError('accountId must be an integer'));
            expect(myMockTPS).not.toHaveBeenCalled();
            expect(myMockSRS).not.toHaveBeenCalled();
        }          
    })

    test('should return error if account number is zero or less', () => {
        let result;
        try {
            result = myTicketService.purchaseTickets(0,[requestAdult]);
        } catch (err) {
            result = err
            expect(result).toEqual(new TypeError('accountId must be an integer'));
            expect(myMockTPS).not.toHaveBeenCalled();
            expect(myMockSRS).not.toHaveBeenCalled();
        }          
    })

    test('should return error if account number is zero or less', () => {
        let result;
        try {
            result = myTicketService.purchaseTickets(-1,[requestAdult]);
        } catch (err) {
            result = err
            expect(result).toEqual(new TypeError('accountId must be an integer'));
            expect(myMockTPS).not.toHaveBeenCalled();
            expect(myMockSRS).not.toHaveBeenCalled();
        }          
    })

    test('random failure in external seat reservation service it should handle error', () => {

        myMockSRS.mockImplementation(() => {
            throw new Error('User not found');
          });

        const result = myTicketService.purchaseTickets(goodAccountNum, [requestAdult]);
        expect(result).toEqual(new InvalidPurchaseException('seat booking failure: Error: User not found'));
        expect(myMockTPS).toHaveBeenCalled();
        expect(myMockSRS).toHaveBeenCalled();   

    })

    test('with random failure in external ticket payment service it should handle error and not reserve seats', () => {
        myMockTPS.mockImplementation(() => {
            throw new Error('User not found');
          });

        const result = myTicketService.purchaseTickets(goodAccountNum, [requestAdult]);
        expect(result).toEqual(new InvalidPurchaseException('payment failure: Error: User not found'));
        expect(myMockTPS).toHaveBeenCalled();
        expect(myMockSRS).not.toHaveBeenCalled();   

    })
})
