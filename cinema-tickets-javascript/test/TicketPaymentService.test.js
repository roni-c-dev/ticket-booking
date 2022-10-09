import TicketPaymentService from "../src/thirdparty/paymentgateway/TicketPaymentService.js";
describe('SeatReservationService', () => {
    const tPS = new TicketPaymentService();

    test('should exist', () => {
        expect(TicketPaymentService).toBeTruthy();
    })

    test('should throw error if accountId not integer', () => {
        try {
            const result = tPS.makePayment('898',40)
            expect(result).toBeFalsy();
        } catch (err) {
            const error  = err;
            expect(error).toEqual(new TypeError('accountId must be an integer'))
        }
    })

    test('should throw error if amount to pay not integer', () => {
        try {
            const result = tPS.makePayment(898, 'FORTY QUID');
            expect(result).toBeFalsy(); 
        } catch (err) {
            const error = err;
            expect(error).toEqual(new TypeError('totalAmountToPay must be an integer'))
        }
    })
})